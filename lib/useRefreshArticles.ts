import { useCallback, useContext } from "react";
import { articleContext } from "@/components/context/ArticleProvider";

export const useRefreshArticles = () => {
  const { setCurrentArticles } = useContext(articleContext);

  return useCallback(async () => {
    const response = await fetch("/api/article");
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error("Kunde inte hämta artiklar.");
    }

    setCurrentArticles(result.data);
  }, [setCurrentArticles]);
};
