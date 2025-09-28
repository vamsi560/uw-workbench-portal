# Backend Alignment Guide for Cyber Insurance Underwriting Workbench

## Overview
This document outlines the comprehensive frontend enhancements implemented for the cyber insurance underwriting workbench portal and the corresponding backend changes required for full functionality.

## Frontend Enhancements Summary

### 1. Enhanced Data Table with Advanced Filtering
**Component**: `src/components/workbench/data-table-toolbar.tsx`

**Frontend Changes**:
- Added work item specific filtering capabilities
- Search functionality across work item properties
- Priority-based filtering (Low, Moderate, Medium, High, Critical)
- Status-based filtering (Pending, In Review, Approved, Rejected)
- Reset filters functionality

**Backend Requirements**:
```typescript
// Work Item API Endpoints
GET /api/workitems?search={query}&priority={priority}&status={status}
```

**Expected Response Structure**:
```json
{
  "workItems": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "priority": "Low" | "Moderate" | "Medium" | "High" | "Critical",
      "status": "Pending" | "In Review" | "Approved" | "Rejected",
      "assignedTo": "string",
      "createdAt": "ISO8601",
      "updatedAt": "ISO8601",
      "riskScore": "number",
      "riskCategories": {
        "technical": "number",
        "operational": "number",
        "financial": "number",
        "compliance": "number"
      }
    }
  ],
  "total": "number",
  "pagination": {
    "page": "number",
    "limit": "number",
    "totalPages": "number"
  }
}
```

### 2. Cyber Risk Assessment System
**Component**: `src/components/workbench/risk-score.tsx`

**Frontend Changes**:
- Risk score calculation and visualization
- Risk category breakdown (Technical, Operational, Financial, Compliance)
- Color-coded risk indicators
- Detailed risk assessment charts

**Backend Requirements**:
```typescript
// Risk Assessment Endpoints
GET /api/workitems/{id}/risk-assessment
POST /api/workitems/{id}/risk-assessment
PUT /api/workitems/{id}/risk-assessment
```

**Risk Assessment Data Structure**:
```json
{
  "overallRiskScore": 75,
  "riskCategories": {
    "technical": 80,
    "operational": 65,
    "financial": 70,
    "compliance": 85
  },
  "riskFactors": [
    {
      "category": "technical",
      "factor": "Outdated security protocols",
      "impact": "High",
      "score": 85
    }
  ],
  "recommendations": [
    {
      "category": "technical",
      "recommendation": "Implement multi-factor authentication",
      "priority": "High"
    }
  ],
  "lastAssessment": "ISO8601",
  "assessedBy": "string"
}
```

### 3. Collaborative Comments System
**Component**: `src/components/workbench/comments-system.tsx`

**Frontend Changes**:
- Real-time commenting system
- User mentions functionality
- Urgency marking for comments
- Comment threading and replies
- Timestamp formatting

**Backend Requirements**:
```typescript
// Comments API Endpoints
GET /api/workitems/{id}/comments
POST /api/workitems/{id}/comments
PUT /api/comments/{commentId}
DELETE /api/comments/{commentId}
GET /api/users/search?query={mention} // for @mentions
```

**Comment Data Structure**:
```json
{
  "id": "string",
  "workItemId": "string",
  "authorId": "string",
  "authorName": "string",
  "content": "string",
  "isUrgent": "boolean",
  "mentions": ["userId1", "userId2"],
  "parentCommentId": "string | null",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601",
  "replies": [
    {
      // nested comment structure
    }
  ]
}
```

### 4. Smart Work Item Assignment System
**Component**: `src/components/workbench/work-item-assignment.tsx`

**Frontend Changes**:
- Intelligent underwriter recommendations
- Specialization-based assignment
- Workload balancing visualization
- Assignment history tracking

**Backend Requirements**:
```typescript
// Assignment Endpoints
GET /api/underwriters/recommendations?workItemId={id}
POST /api/workitems/{id}/assign
GET /api/underwriters/{id}/workload
GET /api/workitems/{id}/assignment-history
```

**Underwriter Data Structure**:
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "specializations": ["Healthcare", "Financial Services", "Technology"],
  "currentWorkload": 15,
  "maxCapacity": 25,
  "avgProcessingTime": "2.5 days",
  "successRate": 92,
  "isAvailable": "boolean",
  "lastAssignment": "ISO8601"
}
```

**Assignment Recommendation Response**:
```json
{
  "recommendations": [
    {
      "underwriter": {
        // Underwriter object
      },
      "score": 95,
      "reasons": [
        "Specializes in Healthcare cybersecurity",
        "Low current workload (60% capacity)",
        "High success rate (92%)"
      ]
    }
  ]
}
```

### 5. Enhanced Work Item Details with Tabbed Interface
**Component**: `src/components/workbench/work-item-details.tsx`

**Frontend Changes**:
- Five-tab interface: Details, Risk Assessment, Comments, Assignment, History
- State management for tab navigation
- Integration of all new enhancement features
- Enhanced UI/UX for comprehensive work item management

**Backend Requirements**:
```typescript
// Work Item History Endpoint
GET /api/workitems/{id}/history
```

**History Data Structure**:
```json
{
  "history": [
    {
      "id": "string",
      "action": "created" | "updated" | "assigned" | "commented" | "risk_assessed",
      "performedBy": "string",
      "performedByName": "string",
      "timestamp": "ISO8601",
      "details": {
        "field": "string",
        "oldValue": "any",
        "newValue": "any"
      },
      "description": "string"
    }
  ]
}
```

### 6. Cyber Insurance Specific Dashboard Analytics
**Component**: `src/components/workbench/dashboard.tsx`

**Frontend Changes**:
- Cyber Risk by Industry chart
- Policy Coverage Types distribution
- Work Items by Status tracking
- Risk Score Distribution visualization

**Backend Requirements**:
```typescript
// Dashboard Analytics Endpoints
GET /api/analytics/cyber-risk-by-industry
GET /api/analytics/policy-coverage-distribution
GET /api/analytics/work-item-status-distribution
GET /api/analytics/risk-score-distribution
```

**Analytics Response Structures**:
```json
// Cyber Risk by Industry
{
  "industries": [
    {
      "name": "Healthcare",
      "averageRiskScore": 85,
      "applicationCount": 12
    }
  ]
}

// Policy Coverage Distribution
{
  "coverageTypes": [
    {
      "name": "First Party Coverage",
      "count": 35,
      "percentage": 35
    }
  ]
}

// Work Item Status Distribution
{
  "statusDistribution": [
    {
      "status": "Pending Review",
      "count": 24
    }
  ]
}

// Risk Score Distribution
{
  "riskDistribution": [
    {
      "range": "Low (0-40)",
      "count": 15,
      "percentage": 18.8
    }
  ]
}
```

## Data Type Extensions

### Enhanced WorkItem Type
```typescript
interface WorkItem {
  // Existing properties
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  
  // New properties for cyber insurance
  riskScore?: number;
  riskCategories?: {
    technical: number;
    operational: number;
    financial: number;
    compliance: number;
  };
  industry?: string;
  companySize?: 'Small' | 'Medium' | 'Large' | 'Enterprise';
  policyType?: string;
  coverageAmount?: number;
  lastRiskAssessment?: string;
  commentsCount?: number;
  hasUrgentComments?: boolean;
}
```

## Real-time Updates Requirements

### WebSocket Events (Alternative to current polling)
```typescript
// WebSocket event types
interface WebSocketEvents {
  'workitem:updated': WorkItem;
  'workitem:assigned': { workItemId: string; assignedTo: string };
  'comment:added': Comment;
  'risk:assessed': { workItemId: string; riskScore: number };
}
```

### Polling Endpoints (Current Implementation)
The frontend currently uses 5-second polling. Ensure these endpoints are optimized:
```typescript
GET /api/workitems/updates?since={timestamp}
GET /api/workitems/{id}/updates?since={timestamp}
```

## Authentication & Authorization Requirements

### Role-Based Access Control
- **Underwriters**: Full access to work items, can comment, assess risk, assign
- **Senior Underwriters**: All underwriter permissions + can reassign work items
- **Managers**: View all work items, analytics dashboard, assignment oversight
- **Risk Analysts**: Focus on risk assessment features, can update risk scores

### API Security Headers
```typescript
// Required headers for API calls
Authorization: Bearer {jwt_token}
Content-Type: application/json
X-Request-ID: {unique_request_id}
```

## Performance Considerations

### Caching Strategy
- Cache underwriter recommendations for 5 minutes
- Cache dashboard analytics for 15 minutes
- Cache work item list with ETags for optimistic caching

### Database Indexing
Recommended database indexes:
- `workitems.status` (for status filtering)
- `workitems.priority` (for priority filtering)
- `workitems.assignedTo` (for assignment queries)
- `workitems.createdAt` (for sorting and pagination)
- `comments.workItemId` (for comment retrieval)
- `risk_assessments.workItemId` (for risk data)

## Testing Requirements

### API Testing Endpoints
Create test endpoints for development:
```typescript
POST /api/test/seed-workitems // Seed test data
POST /api/test/reset-database // Reset to clean state
GET /api/test/mock-underwriters // Get mock underwriter data
```

## Monitoring & Logging

### Key Metrics to Track
- Work item processing time
- Assignment efficiency
- Risk assessment completion rate
- User engagement with comments system
- Dashboard load times

### Error Logging
Ensure comprehensive error logging for:
- Failed work item assignments
- Risk calculation errors
- Comment system failures
- Authentication issues

## Migration Strategy

### Phase 1: Core Data Model
1. Extend work item table with risk score fields
2. Create comments table
3. Create risk assessments table
4. Update user roles and permissions

### Phase 2: API Implementation
1. Implement filtering and search endpoints
2. Build risk assessment APIs
3. Create comments system APIs
4. Develop assignment recommendation engine

### Phase 3: Analytics & Optimization
1. Implement dashboard analytics endpoints
2. Add caching layer
3. Optimize database queries
4. Set up monitoring and logging

## Conclusion

This frontend enhancement suite transforms the basic workbench into a comprehensive cyber insurance underwriting platform. The backend implementation should prioritize the core work item management features first, followed by the risk assessment system, and finally the advanced analytics dashboard.

All endpoints should be implemented with proper error handling, validation, and security measures. Consider implementing rate limiting for API endpoints and ensure proper data validation for all user inputs.

The polling system currently in place works well but could be enhanced with WebSocket implementation for true real-time updates in future iterations.