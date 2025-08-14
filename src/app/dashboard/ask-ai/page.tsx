
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Loader2, User, Bot } from "lucide-react";
import { askKnowledgeAgentAction } from "@/lib/actions";
import { useData } from "@/context/data-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import Markdown from 'react-markdown';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AskAiPage() {
  const { currentUser } = useData();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const result = await askKnowledgeAgentAction(input);

    if (result.success && result.data) {
      const assistantMessage: Message = { role: 'assistant', content: result.data };
      setMessages(prev => [...prev, assistantMessage]);
    } else {
      const errorMessage: Message = { role: 'assistant', content: `Maaf, terjadi kesalahan: ${result.error}` };
      setMessages(prev => [...prev, errorMessage]);
    }
    setIsLoading(false);
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <main className="flex flex-1 flex-col p-4 md:p-8">
      <PageHeader title="Ask AI" />

      <div className="flex-1 flex flex-col gap-4 max-h-[calc(100vh-150px)]">
        <Card className="flex-1 flex flex-col">
          <CardContent className="flex-1 flex flex-col p-4 gap-4">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6">
                {messages.length === 0 && (
                  <div className="text-center text-muted-foreground pt-16">
                    <Sparkles className="mx-auto h-12 w-12 mb-4 text-primary" />
                    <h2 className="text-xl font-semibold">Tanya Apa Saja</h2>
                    <p className="mt-2">Ajukan pertanyaan tentang data instansi, kontrak, atau status pekerjaan.</p>
                     <p className="text-sm mt-4">Contoh: "Berapa banyak kontrak PKS yang aktif?"</p>
                  </div>
                )}
                {messages.map((message, index) => (
                  <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                    {message.role === 'assistant' && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Bot className="h-5 w-5" />
                      </div>
                    )}
                     <div className={`rounded-lg px-4 py-3 max-w-2xl ${message.role === 'user' ? 'bg-muted' : 'bg-background border'}`}>
                        <div className="prose prose-sm prose-p:my-0 max-w-none">
                            <Markdown>{message.content}</Markdown>
                        </div>
                    </div>
                     {message.role === 'user' && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-semibold">
                       {getInitials(currentUser?.nama)}
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Bot className="h-5 w-5" />
                        </div>
                        <div className="rounded-lg px-4 py-3 bg-background border flex items-center">
                            <Loader2 className="h-5 w-5 animate-spin"/>
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t pt-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pertanyaan Anda di sini..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">Kirim</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
