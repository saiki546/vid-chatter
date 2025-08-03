import { useLocation, Link } from "react-router-dom";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Upload } from "lucide-react";

export default function Chat() {
  const location = useLocation();
  const { transcript, title } = location.state || {};

  if (!transcript || !title) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
        <Card className="p-8">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto">
              <MessageSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold">No Content Available</h2>
            <p className="text-muted-foreground">
              You need to process a video or audio file first before you can chat about it.
            </p>
            <Link to="/">
              <Button className="gap-2">
                <Upload className="w-4 h-4" />
                Upload Content
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Upload
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">AI Chat Assistant</h1>
        <p className="text-muted-foreground">
          Ask questions about your video content - powered by AI
        </p>
      </div>

      <ChatInterface transcript={transcript} title={title} />
    </div>
  );
}