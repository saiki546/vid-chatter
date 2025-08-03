import { useState, useEffect } from "react";
import { SummaryCard } from "@/components/summary/SummaryCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { History as HistoryIcon, Search, Upload, Filter } from "lucide-react";
import { Link } from "react-router-dom";

interface HistoryItem {
  id: string;
  title: string;
  summary: string;
  transcript: string;
  duration?: string;
  source: "youtube" | "file";
  sourceUrl?: string;
  fileName?: string;
  timestamp: Date;
}

export default function History() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSource, setFilterSource] = useState<"all" | "youtube" | "file">("all");

  useEffect(() => {
    // Load mock history data
    const mockHistory: HistoryItem[] = [
      {
        id: "1",
        title: "AI Technology Discussion",
        summary: "A comprehensive overview of artificial intelligence trends and their impact on modern industries.",
        transcript: "This is a sample transcript discussing AI technology...",
        duration: "15:30",
        source: "youtube",
        sourceUrl: "https://www.youtube.com/watch?v=example1",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        id: "2",
        title: "Product Launch Presentation",
        summary: "Marketing presentation covering the launch strategy for a new software product.",
        transcript: "This presentation covers our new product launch...",
        duration: "22:15",
        source: "file",
        fileName: "product_launch.mp4",
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
      },
      {
        id: "3",
        title: "Interview with Tech CEO",
        summary: "Insightful conversation about startup culture and technology innovation.",
        transcript: "In this interview, we discuss the future of technology...",
        duration: "45:20",
        source: "youtube",
        sourceUrl: "https://www.youtube.com/watch?v=example2",
        timestamp: new Date(Date.now() - 259200000), // 3 days ago
      },
    ];

    setHistoryItems(mockHistory);
  }, []);

  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterSource === "all" || item.source === filterSource;
    return matchesSearch && matchesFilter;
  });

  if (historyItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
        <Card className="p-8">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto">
              <HistoryIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold">No History Yet</h2>
            <p className="text-muted-foreground">
              Your processed videos and audio files will appear here.
            </p>
            <Link to="/">
              <Button className="gap-2">
                <Upload className="w-4 h-4" />
                Process Your First File
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Processing History</h1>
        <p className="text-muted-foreground">
          View and manage all your processed content
        </p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search your content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={filterSource === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterSource("all")}
          >
            All
          </Button>
          <Button
            variant={filterSource === "youtube" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterSource("youtube")}
          >
            YouTube
          </Button>
          <Button
            variant={filterSource === "file" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterSource("file")}
          >
            Files
          </Button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <Filter className="w-12 h-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-semibold">No Results Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {filteredItems.map((item) => (
            <SummaryCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}