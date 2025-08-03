import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TranscriptViewer } from "@/components/transcript/TranscriptViewer";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface SummaryCardProps {
  title: string;
  summary: string;
  transcript: string;
  duration?: string;
  source: "youtube" | "file";
  sourceUrl?: string;
  fileName?: string;
  timestamp: Date;
}

export function SummaryCard({
  title,
  summary,
  transcript,
  duration,
  source,
  sourceUrl,
  fileName,
  timestamp,
}: SummaryCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{timestamp.toLocaleDateString()}</span>
              {duration && (
                <>
                  <span>•</span>
                  <span>{duration}</span>
                </>
              )}
            </div>
          </div>
          <Badge variant={source === "youtube" ? "default" : "secondary"}>
            {source === "youtube" ? "YouTube" : "File Upload"}
          </Badge>
        </div>
        
        {source === "youtube" && sourceUrl && (
          <p className="text-sm text-muted-foreground break-all">{sourceUrl}</p>
        )}
        {source === "file" && fileName && (
          <p className="text-sm text-muted-foreground">{fileName}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Summary
          </h4>
          <p className="text-muted-foreground leading-relaxed">{summary}</p>
        </div>
        
        <div className="flex gap-2 pt-4 border-t">
          <TranscriptViewer transcript={transcript} title={title} />
          <Link to="/chat" state={{ transcript, title }}>
            <Button variant="outline" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Ask Questions
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}