import { useEffect } from "react";
type UseSeoProps = {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
};

export function useSeo({ title, description, ogTitle, ogDescription }: UseSeoProps) {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    if (description) setMeta('description', description);
    if (ogTitle) setMeta('og:title', ogTitle);
    if (ogDescription) setMeta('og:description', ogDescription);
  }, [title, description, ogTitle, ogDescription]);
}