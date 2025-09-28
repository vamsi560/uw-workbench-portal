"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, AtSign } from "lucide-react";

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  mentions?: string[];
  priority?: 'normal' | 'urgent';
}

interface CommentsSystemProps {
  workItemId: string;
  comments: Comment[];
  onAddComment: (content: string, mentions?: string[]) => void;
}

export function CommentsSystem({ workItemId, comments, onAddComment }: CommentsSystemProps) {
  const [newComment, setNewComment] = useState("");
  const [mentions, setMentions] = useState<string[]>([]);

  const handleSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment, mentions);
      setNewComment("");
      setMentions([]);
    }
  };

  const handleMention = (user: string) => {
    if (!mentions.includes(user)) {
      setMentions([...mentions, user]);
      setNewComment(prev => prev + `@${user} `);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4" />
        <h3 className="font-semibold">Comments ({comments.length})</h3>
      </div>

      {/* Comments List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No comments yet. Be the first to add one!
          </p>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="bg-muted/20">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getAuthorInitials(comment.author)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{comment.author}</span>
                    {comment.priority === 'urgent' && (
                      <Badge variant="destructive" className="text-xs">Urgent</Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(comment.timestamp)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                {comment.mentions && comment.mentions.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {comment.mentions.map((mention) => (
                      <Badge key={mention} variant="secondary" className="text-xs">
                        @{mention}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Comment */}
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-3">
            <Textarea
              placeholder="Add a comment... Use @username to mention someone"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            
            {/* Quick mention buttons */}
            <div className="flex items-center gap-2">
              <AtSign className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-1">
                {['John Doe', 'Sarah Smith', 'Mike Johnson'].map((user) => (
                  <Button
                    key={user}
                    variant="outline"
                    size="sm"
                    onClick={() => handleMention(user)}
                    className="text-xs"
                  >
                    @{user.split(' ')[0]}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNewComment(prev => '[URGENT] ' + prev);
                  }}
                >
                  Mark Urgent
                </Button>
              </div>
              <Button onClick={handleSubmit} disabled={!newComment.trim()}>
                <Send className="h-4 w-4 mr-1" />
                Comment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}