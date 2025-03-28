import React from "react";
import { Redirect } from "expo-router";

export default function HomeIndex() {
  // 重定向到 (tabs) 目录下的首页
  console.log("HomeIndex: 重定向到 tabs 首页");
  return <Redirect href="/social/(home)/(tabs)" />;
}
