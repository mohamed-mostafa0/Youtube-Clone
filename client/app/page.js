"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CategoryBar from "../components/CategoryBar";
import VideoGrid from "../components/video/VideoGrid";
import VideoSkeleton from "../components/video/VideoSkeleton";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlCategory = searchParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState(urlCategory || "All");

  useEffect(() => {
    if (urlCategory) {
      setSelectedCategory(urlCategory);
    } else {
      setSelectedCategory("All");
    }
  }, [urlCategory]);

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    if (!category || category.toLowerCase() === "all") {
      router.push("/", { scroll: false });
    } else {
      router.push(`/?category=${encodeURIComponent(category.toLowerCase())}`, { scroll: false });
    }
  };

  const handleResetCategory = () => {
    handleSelectCategory("All");
  };

  return (
    <>
      <CategoryBar 
        selectedCategory={selectedCategory} 
        onSelectCategory={handleSelectCategory} 
      />
      <VideoGrid 
        category={selectedCategory} 
        onResetCategory={handleResetCategory} 
      />
    </>
  );
}

function HomeLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 gap-y-8 p-4">
      {[...Array(9)].map((_, i) => (
        <VideoSkeleton key={i} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}

