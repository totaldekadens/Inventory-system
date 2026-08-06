// hooks/useRefreshArticles.ts

import { articleContext } from "@/components/context/ArticleProvider";
import { articleApi } from "@/lib/api/articles";
import { useCallback, useContext } from "react";

export const useRefreshArticles = () => {
  const { setArticles, setCurrentArticles, setCurrentArticle } =
    useContext(articleContext);

  return useCallback(async (): Promise<void> => {
    const articles = await articleApi.getAll();

    setArticles(articles);
    setCurrentArticles(articles);

    setCurrentArticle((current) => {
      if (!current) {
        return undefined;
      }

      return articles.find(
        (article) => String(article._id) === String(current._id),
      );
    });
  }, [setArticles, setCurrentArticles, setCurrentArticle]);
};
