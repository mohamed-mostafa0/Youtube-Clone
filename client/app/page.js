"use client";

import { useEffect } from "react";
import CategoryBar from "../components/CategoryBar";
import VideoGrid from "../components/VideoGrid";
import API from "./api/axios";

export default function Home() {
  return (
    <>
      <CategoryBar />
      <VideoGrid />
    </>
  );
}
