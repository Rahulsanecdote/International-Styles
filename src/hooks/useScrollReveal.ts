"use client";

import { useEffect } from "react";

export function useScrollReveal() {
  useEffect(() => {
    // `.reveal` starts at opacity 0 and is only shown once observed, so any
    // element mounted after this effect ran would stay permanently invisible.
    // A MutationObserver picks those up as they appear.
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Reveal is one-way — stop watching once it has played.
            intersectionObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    const observeAll = (root: ParentNode) => {
      root.querySelectorAll(".reveal:not(.visible)").forEach((element) => {
        intersectionObserver.observe(element);
      });
    };

    observeAll(document);

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.classList.contains("reveal")) {
            intersectionObserver.observe(node);
          }
          observeAll(node);
        }
      }
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutationObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, []);
}
