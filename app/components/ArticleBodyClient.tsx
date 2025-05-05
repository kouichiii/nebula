"use client";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";

export default function ArticleBodyClient({ articleId }: { articleId: string }) {
  const [body, setBody] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/article-body/${articleId}`)
      .then((res) => res.json())
      .then((data) => setBody(data.body || ""))
      .finally(() => setLoading(false));
  }, [articleId]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-6 w-full bg-gray-100 rounded" />
        <div className="h-6 w-5/6 bg-gray-100 rounded" />
        <div className="h-6 w-2/3 bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div className="prose prose-purple max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
    </div>
  );
} 