"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";

export interface LikeButtonProps {
  className?: string;
  liked?: boolean;
  handleWishList?: any
}

const LikeButton: React.FC<LikeButtonProps> = ({
  className = "",
  liked = false,
  handleWishList
}) => {
  //const [isLiked, setIsLiked] = useState(liked);

  // make random for demo
  const setIsLiked = () => {
    handleWishList()
  }

  return (
    <button className={`w-9 h-9 flex items-center justify-center rounded-full ${liked ? 'bg-red-50' : 'bg-white'} dark:bg-slate-900 text-neutral-700 dark:text-slate-200 nc-shadow-lg ${className}`} onClick={() => setIsLiked()} >
      <HeartIcon className={`h-5 w-5 ${liked ? 'text-red-600' : 'text-slate-500'}`} />
    </button>
  );
};

export default LikeButton;
