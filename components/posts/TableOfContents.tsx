"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  markdown: string;
}

export default function TableOfContents({ markdown }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // DOM에서 실제 렌더링된 헤딩 요소들을 찾아서 TOC 구성
    const headingElements = document.querySelectorAll(
      "article h1[id], article h2[id], article h3[id], article h4[id], article h5[id], article h6[id]",
    );

    const headings: TocItem[] = Array.from(headingElements).map((element) => {
      const level = parseInt(element.tagName.substring(1)); // H1 -> 1, H2 -> 2, ...
      const title = element.textContent || "";
      const id = element.id;

      return { id, title, level };
    });

    setToc(headings);
  }, [markdown]);

  useEffect(() => {
    if (toc.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // 헤더 높이 + 여유

      // 현재 스크롤 위치보다 위에 있는 헤딩들을 찾음
      let currentActiveId = "";

      for (const { id } of toc) {
        const element = document.getElementById(id);
        if (element) {
          const elementTop = element.offsetTop;

          if (elementTop <= scrollPosition) {
            currentActiveId = id;
          } else {
            break;
          }
        }
      }

      if (currentActiveId && currentActiveId !== activeId) {
        setActiveId(currentActiveId);
      }
    };

    // 초기 실행
    handleScroll();

    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [toc, activeId]);

  if (toc.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav className="sticky top-24">
      <div className="bg-gray-600 rounded-lg p-6 border border-gray-700">
        <h2 className="text-lg font-bold text-primary-900 mb-4">On this page</h2>
        <ul className="space-y-2">
          {toc.map(({ id, title, level }) => (
            <li key={id} style={{ paddingLeft: `${(level - 1) * 12}px` }} className="transition-colors">
              <button
                onClick={(e) => handleClick(e, id)}
                className={`text-left cursor-pointer text-sm hover:text-primary-900 transition-colors w-full ${
                  activeId === id ? "text-primary-900 font-semibold" : "text-gray-200"
                }`}
              >
                {title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
