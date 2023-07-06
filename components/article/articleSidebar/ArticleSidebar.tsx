import { PopulatedArticleDocument } from "../../context/ArticleProvider";
import { useState } from "react";
import SidebarEdit from "./SidebarEdit.tsx";
import SidebarRead from "./SidebarRead";

interface Props {
  article: PopulatedArticleDocument;
  className?: string;
}

const ArticleSidebar = ({ article, className }: Props) => {
  const [edit, setEdit] = useState(false);
  return (
    <>
      {edit ? (
        <SidebarEdit
          article={article}
          edit={edit}
          setEdit={setEdit}
          className={className}
        />
      ) : (
        <SidebarRead
          article={article}
          setEdit={setEdit}
          className={className}
        />
      )}
    </>
  );
};

export default ArticleSidebar;
