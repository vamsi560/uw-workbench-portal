# Backend Alignment Requirements

## Overview
This document outlines the backend changes required to support the enhanced UI features implemented in the Cyber Insurance Underwriting Workbench. The changes include realistic ID formats, enhanced approval workflows, comprehensive dashboard metrics, and improved data structures.

## 1. Database Schema Updates

### 1.1 Submissions Table Updates

```sql
-- Update submission ID format to S12094 style
ALTER TABLE submissions MODIFY COLUMN id VARCHAR(10) NOT NULL;

-- Update existing submission IDs to new format
UPDATE submissions SET id = CONCAT('S', LPAD(CAST(SUBSTRING(id, 2) AS UNSIGNED) + 11749, 5, '0'));

-- Add new submission record
INSERT INTO submissions (
    id, taskPending, effectiveDate, expiryDate, insuredName, 
    underwriter, status, new, producer, producerInternal, mfaEnforced
) VALUES (
    'S12103', 'Yes', '2025-09-28', '2026-09-28', 'SecureLink Technologies', 
    'Wanda Maximoff', 'Under Review', 'New', 'CyberGuard Brokers', 
    'CyberGuard Brokers', 'Yes'
);
```

### 1.2 Work Items Table Updates

```sql
-- Update work item ID format to 10045 style
ALTER TABLE work_items MODIFY COLUMN id VARCHAR(10) NOT NULL;

-- Convert existing work item IDs (W5350 -> 10045)
UPDATE work_items SET id = CAST(SUBSTRING(id, 2) AS UNSIGNED) + 4695;

-- Add new work items
INSERT INTO work_items (
    id, owner, type, priority, gwpcStatus, status, 
    indicated, automationStatus, exposureStatus, submissionId
) VALUES 
    ('10049', 'Bruce Banner', 'Risk Assessment', 'High', 'Approved', 'Done', 
     true, 'Complete', 'New', 'S12098'),
    ('10050', 'Carol Danvers', 'Policy Review', 'Medium', 'Pending', 'WIP', 
     false, 'In Progress', 'Renewed', 'S12099');
```

### 1.3 Tasks Table Updates

```sql
-- Update foreign key references to match new submission IDs
UPDATE tasks SET submissionId = 'S12094' WHERE submissionId = 'S345821';
UPDATE tasks SET submissionId = 'S12095' WHERE submissionId = 'S489234';
UPDATE tasks SET submissionId = 'S12096' WHERE submissionId = 'S512345';
UPDATE tasks SET submissionId = 'S12097' WHERE submissionId = 'S678901';
UPDATE tasks SET submissionId = 'S12098' WHERE submissionId = 'S789012';
UPDATE tasks SET submissionId = 'S12099' WHERE submissionId = 'S890123';
UPDATE tasks SET submissionId = 'S12100' WHERE submissionId = 'S901234';
UPDATE tasks SET submissionId = 'S12101' WHERE submissionId = 'S123456';
UPDATE tasks SET submissionId = 'S12102' WHERE submissionId = 'S234567';
```

### 1.4 New Tables for Enhanced Features

```sql
-- Audit log table for tracking approval actions
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    action VARCHAR(50) NOT NULL,
    entityType VARCHAR(30) NOT NULL,
    entityId VARCHAR(20) NOT NULL,
    userId VARCHAR(50) NOT NULL,
    details JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_entity (entityType, entityId),
    INDEX idx_user (userId),
    INDEX idx_timestamp (timestamp)
);

-- Performance metrics cache table
CREATE TABLE performance_metrics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    metric_name VARCHAR(50) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP NOT NULL,
    INDEX idx_metric_name (metric_name),
    INDEX idx_valid_until (valid_until)
);

-- Activity feed table
CREATE TABLE activity_feed (
    id INT PRIMARY KEY AUTO_INCREMENT,
    activity_type VARCHAR(30) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    entity_type VARCHAR(30) NOT NULL,
    entity_id VARCHAR(20) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    status VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_created_at (created_at),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_user (user_id)
);
```

## 2. API Endpoint Updates

### 2.1 Enhanced Dashboard Statistics API

```javascript
// GET /api/dashboard/stats
app.get('/api/dashboard/stats', async (req, res) => {
    try {
        const [
            totalSubmissions,
            totalSubmissionsLastMonth,
            pendingReview,
            pendingReviewLastWeek,
            approved,
            approvedLastQuarter,
            requiresAttention,
            requiresAttentionYesterday
        ] = await Promise.all([
            Submission.count(),
            Submission.count({ 
                where: { 
                    createdAt: { 
                        [Op.gte]: moment().subtract(1, 'month').toDate() 
                    } 
                } 
            }),
            Submission.count({ 
                where: { 
                    status: { 
                        [Op.in]: ['Under Review', 'Pending'] 
                    } 
                } 
            }),
            WorkItem.count({ 
                where: { 
                    priority: 'High', 
                    status: 'WIP' 
                } 
            })
        ]);

        const stats = {
            totalSubmissions: {
                value: totalSubmissions.toString(),
                change: calculatePercentageChange(totalSubmissions, totalSubmissionsLastMonth),
                trend: totalSubmissions > totalSubmissionsLastMonth ? 'up' : 'down',
                description: 'This month'
            },
            pendingReview: {
                value: pendingReview.toString(),
                change: calculatePercentageChange(pendingReview, pendingReviewLastWeek),
                trend: pendingReview < pendingReviewLastWeek ? 'down' : 'up',
                description: 'Awaiting action'
            },
            approved: {
                value: approved.toString(),
                change: calculatePercentageChange(approved, approvedLastQuarter),
                trend: approved > approvedLastQuarter ? 'up' : 'down',
                description: 'This quarter'
            },
            requiresAttention: {
                value: requiresAttention.toString(),
                change: `+${requiresAttention - requiresAttentionYesterday}`,
                trend: 'alert',
                description: 'High priority'
            }
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function calculatePercentageChange(current, previous) {
    if (previous === 0) return '+0%';
    const change = ((current - previous) / previous) * 100;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
}
```

### 2.2 Recent Activity API

```javascript
// GET /api/dashboard/recent-activity
app.get('/api/dashboard/recent-activity', async (req, res) => {
    try {
        const activities = await db.query(`
            SELECT 
                af.id,
                af.title,
                af.description,
                af.status,
                af.created_at,
                af.entity_type,
                af.entity_id
            FROM activity_feed af
            ORDER BY af.created_at DESC
            LIMIT 10
        `);

        const formattedActivities = activities.map(activity => ({
            id: activity.id,
            title: activity.title,
            description: activity.description,
            status: activity.status,
            timestamp: activity.created_at,
            entityType: activity.entity_type,
            entityId: activity.entity_id
        }));

        res.json(formattedActivities);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

### 2.3 Performance Metrics API

```javascript
// GET /api/dashboard/performance
app.get('/api/dashboard/performance', async (req, res) => {
    try {
        // Check cache first
        const cachedMetrics = await PerformanceMetric.findAll({
            where: {
                valid_until: {
                    [Op.gt]: new Date()
                }
            }
        });

        let metrics = {};
        const requiredMetrics = ['processing_efficiency', 'average_response_time', 'quality_score'];
        
        for (const metric of requiredMetrics) {
            const cached = cachedMetrics.find(m => m.metric_name === metric);
            if (cached) {
                metrics[metric] = cached.metric_value;
            } else {
                // Calculate and cache
                const value = await calculateMetric(metric);
                metrics[metric] = value;
                
                await PerformanceMetric.create({
                    metric_name: metric,
                    metric_value: value,
                    valid_until: moment().add(5, 'minutes').toDate()
                });
            }
        }

        res.json({
            processingEfficiency: {
                value: metrics.processing_efficiency,
                target: 95.0,
                unit: '%'
            },
            averageResponseTime: {
                value: metrics.average_response_time,
                target: 2.0,
                unit: 'days'
            },
            qualityScore: {
                value: metrics.quality_score,
                target: 98.0,
                unit: '%'
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

## 3. Enhanced Assignment Workflow API

### 3.1 Assignment Approval Endpoint

```javascript
// POST /api/work-items/:id/approve-assignment
app.post('/api/work-items/:id/approve-assignment', async (req, res) => {
    const { underwriterId, submissionId } = req.body;
    const workItemId = req.params.id;
    
    try {
        await db.transaction(async (transaction) => {
            // Update work item assignment (mark as pending save)
            await WorkItem.update(
                { 
                    assigned_to: underwriterId, 
                    assignment_status: 'approved_pending_save',
                    updatedAt: new Date()
                },
                { 
                    where: { id: workItemId }, 
                    transaction 
                }
            );
            
            // Log approval action
            await AuditLog.create({
                action: 'assignment_approved',
                entityType: 'work_item',
                entityId: workItemId,
                userId: req.user.id,
                details: JSON.stringify({ 
                    underwriterId, 
                    submissionId,
                    timestamp: new Date().toISOString()
                })
            }, { transaction });
            
            // Create activity feed entry
            await ActivityFeed.create({
                activity_type: 'assignment_approved',
                title: 'Assignment Approved',
                description: `Work item ${workItemId} approved for assignment to ${underwriterId}`,
                entity_type: 'work_item',
                entity_id: workItemId,
                user_id: req.user.id,
                status: 'pending_save'
            }, { transaction });
        });
        
        res.json({ 
            success: true, 
            message: 'Assignment approved - pending save',
            requiresSave: true
        });
    } catch (error) {
        console.error('Assignment approval error:', error);
        res.status(500).json({ error: error.message });
    }
});
```

### 3.2 Enhanced Save Endpoint

```javascript
// PUT /api/work-items/:id/save
app.put('/api/work-items/:id/save', async (req, res) => {
    const { workItem, submission } = req.body;
    const workItemId = req.params.id;
    
    try {
        await db.transaction(async (transaction) => {
            // Save work item changes
            const updatedWorkItem = await WorkItem.update(
                {
                    ...workItem,
                    assignment_status: 'active', // Clear pending status
                    updatedAt: new Date()
                },
                { 
                    where: { id: workItemId }, 
                    transaction,
                    returning: true
                }
            );
            
            // Save submission changes if provided
            if (submission && submission.id) {
                await Submission.update(
                    {
                        ...submission,
                        updatedAt: new Date()
                    },
                    { 
                        where: { id: submission.id }, 
                        transaction 
                    }
                );
            }
            
            // Log save action
            await AuditLog.create({
                action: 'work_item_saved',
                entityType: 'work_item',
                entityId: workItemId,
                userId: req.user.id,
                details: JSON.stringify({
                    changes: workItem,
                    submissionUpdated: !!submission,
                    timestamp: new Date().toISOString()
                })
            }, { transaction });
        });
        
        res.json({ 
            success: true,
            message: 'Work item saved successfully'
        });
    } catch (error) {
        console.error('Save error:', error);
        res.status(500).json({ error: error.message });
    }
});
```

## 4. Enhanced Search API

### 4.1 Global Search Endpoint

```javascript
// GET /api/search
app.get('/api/search', async (req, res) => {
    const { q, type = 'all', limit = 20 } = req.query;
    
    if (!q || q.trim().length < 2) {
        return res.json({ submissions: [], workItems: [], total: 0 });
    }
    
    try {
        const searchTerm = q.trim();
        const results = {};
        
        if (type === 'all' || type === 'submissions') {
            results.submissions = await Submission.findAll({
                where: {
                    [Op.or]: [
                        { id: { [Op.like]: `%${searchTerm}%` } },
                        { insuredName: { [Op.like]: `%${searchTerm}%` } },
                        { underwriter: { [Op.like]: `%${searchTerm}%` } },
                        { producer: { [Op.like]: `%${searchTerm}%` } }
                    ]
                },
                limit: parseInt(limit),
                order: [['updatedAt', 'DESC']]
            });
        }
        
        if (type === 'all' || type === 'work_items') {
            results.workItems = await WorkItem.findAll({
                where: {
                    [Op.or]: [
                        { id: { [Op.like]: `%${searchTerm}%` } },
                        { owner: { [Op.like]: `%${searchTerm}%` } },
                        { type: { [Op.like]: `%${searchTerm}%` } },
                        { submissionId: { [Op.like]: `%${searchTerm}%` } }
                    ]
                },
                limit: parseInt(limit),
                order: [['updatedAt', 'DESC']]
            });
        }
        
        const total = (results.submissions?.length || 0) + (results.workItems?.length || 0);
        
        res.json({
            submissions: results.submissions || [],
            workItems: results.workItems || [],
            total,
            query: searchTerm
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ error: error.message });
    }
});
```

## 5. Validation Updates

### 5.1 Enhanced Validation Schemas

```javascript
const Joi = require('joi');

// Updated validation schemas for new ID formats
const validationSchemas = {
    submission: Joi.object({
        id: Joi.string().pattern(/^S\d{5}$/).required().messages({
            'string.pattern.base': 'Submission ID must be in format S12345'
        }),
        insuredName: Joi.string().min(2).max(100).required(),
        underwriter: Joi.string().min(2).max(50).required(),
        status: Joi.string().valid('Booked', 'Closed', 'Under Review', 'Declined').required(),
        taskPending: Joi.string().valid('Yes', 'No').required(),
        effectiveDate: Joi.date().required(),
        expiryDate: Joi.date().greater(Joi.ref('effectiveDate')).required(),
        producer: Joi.string().min(2).max(100).required(),
        mfaEnforced: Joi.string().valid('Yes', 'No').required()
    }),
    
    workItem: Joi.object({
        id: Joi.string().pattern(/^\d{5}$/).required().messages({
            'string.pattern.base': 'Work item ID must be a 5-digit number'
        }),
        owner: Joi.string().min(2).max(50).required(),
        type: Joi.string().min(3).max(50).required(),
        priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').required(),
        gwpcStatus: Joi.string().valid('Approved', 'Declined', 'Pending').required(),
        status: Joi.string().valid('To Do', 'WIP', 'Done').required(),
        indicated: Joi.boolean().required(),
        automationStatus: Joi.string().valid('Not Applicable', 'In Progress', 'Complete').required(),
        exposureStatus: Joi.string().valid('New', 'Renewed', 'Endorsed').required(),
        submissionId: Joi.string().pattern(/^S\d{5}$/).required()
    }),
    
    assignmentApproval: Joi.object({
        underwriterId: Joi.string().min(1).max(50).required(),
        submissionId: Joi.string().pattern(/^S\d{5}$/).required(),
        workItemId: Joi.string().pattern(/^\d{5}$/).required()
    })
};
```

## 6. Migration Scripts

### 6.1 Database Migration Script

```javascript
// migrations/202509280001_realistic_ids_migration.js
'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        
        try {
            // Create backup of original IDs
            await queryInterface.addColumn('submissions', 'original_id', {
                type: Sequelize.STRING(20),
                allowNull: true
            }, { transaction });
            
            // Store original IDs
            await queryInterface.sequelize.query(
                'UPDATE submissions SET original_id = id',
                { transaction }
            );
            
            // Update submission IDs (S345821 -> S12094)
            await queryInterface.sequelize.query(`
                UPDATE submissions 
                SET id = CONCAT('S', LPAD(CAST(SUBSTRING(id, 2) AS UNSIGNED) + 11749, 5, '0'))
                WHERE id LIKE 'S%'
            `, { transaction });
            
            // Update work item IDs (W5350 -> 10045)  
            await queryInterface.sequelize.query(`
                UPDATE work_items 
                SET id = CAST(SUBSTRING(id, 2) AS UNSIGNED) + 4695
                WHERE id LIKE 'W%'
            `, { transaction });
            
            // Update foreign key references
            const updates = [
                ['S345821', 'S12094'],
                ['S489234', 'S12095'],
                ['S512345', 'S12096'],
                ['S678901', 'S12097'],
                ['S789012', 'S12098'],
                ['S890123', 'S12099'],
                ['S901234', 'S12100'],
                ['S123456', 'S12101'],
                ['S234567', 'S12102']
            ];
            
            for (const [oldId, newId] of updates) {
                await queryInterface.sequelize.query(
                    'UPDATE tasks SET submissionId = ? WHERE submissionId = ?',
                    { 
                        replacements: [newId, oldId],
                        transaction 
                    }
                );
            }
            
            await transaction.commit();
            console.log('Migration completed successfully');
        } catch (error) {
            await transaction.rollback();
            console.error('Migration failed:', error);
            throw error;
        }
    },
    
    down: async (queryInterface, Sequelize) => {
        // Rollback logic here
        console.log('Migration rollback completed');
    }
};
```

## 7. Configuration Updates

### 7.1 Application Configuration

```javascript
// config/application.js
module.exports = {
    // ID Format Configuration
    idFormats: {
        submission: {
            prefix: 'S',
            length: 5,
            pattern: /^S\d{5}$/,
            example: 'S12094'
        },
        workItem: {
            prefix: '',
            length: 5,
            pattern: /^\d{5}$/,
            example: '10045'
        }
    },
    
    // Dashboard Configuration
    dashboard: {
        refreshInterval: 30000, // 30 seconds
        cacheTtl: 300, // 5 minutes
        maxRecentActivities: 10,
        enableRealTimeUpdates: true
    },
    
    // Notification Configuration
    notifications: {
        assignmentApproval: {
            enabled: true,
            delay: 0 // immediate
        },
        statusChanges: {
            enabled: true,
            delay: 1000 // 1 second delay
        }
    }
};
```

## 8. Testing Requirements

### 8.1 Unit Tests for New APIs

```javascript
// tests/api/dashboard.test.js
describe('Dashboard API', () => {
    test('should return correct statistics format', async () => {
        const response = await request(app)
            .get('/api/dashboard/stats')
            .expect(200);
            
        expect(response.body).toMatchObject({
            totalSubmissions: {
                value: expect.any(String),
                change: expect.stringMatching(/^[+-]\d+\.\d%$/),
                trend: expect.stringMatching(/^(up|down)$/),
                description: expect.any(String)
            }
        });
    });
});

// tests/api/assignment.test.js
describe('Assignment Workflow API', () => {
    test('should approve assignment without auto-save', async () => {
        const response = await request(app)
            .post('/api/work-items/10045/approve-assignment')
            .send({
                underwriterId: 'user123',
                submissionId: 'S12094'
            })
            .expect(200);
            
        expect(response.body).toMatchObject({
            success: true,
            requiresSave: true
        });
    });
});
```

## 9. Deployment Checklist

- [ ] Run database migration script
- [ ] Update environment variables
- [ ] Deploy new API endpoints
- [ ] Test assignment approval workflow
- [ ] Verify dashboard statistics calculation
- [ ] Test search functionality with new ID formats
- [ ] Validate performance metrics calculation
- [ ] Check notification system
- [ ] Verify audit logging
- [ ] Test rollback procedures

## 10. Monitoring and Alerting

### 10.1 Key Metrics to Monitor

- Dashboard API response times
- Assignment approval success rate
- Search query performance
- Database query performance
- Cache hit rates
- Notification delivery success rate

### 10.2 Alert Thresholds

- API response time > 2 seconds
- Assignment approval failures > 5%
- Search query time > 1 second
- Database connection pool utilization > 80%
- Cache hit rate < 70%

This comprehensive backend alignment ensures that all enhanced UI features are properly supported with robust, scalable backend services.