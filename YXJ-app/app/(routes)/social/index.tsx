import { Redirect } from "expo-router";
import { useAuth } from "./providers/AuthProvider";

export default function SocialScreen() {
  // 不管用户是否登录，都直接进入社交页面
  return <Redirect href="/social/(home)" />;

  // 原来的逻辑：根据用户登录状态决定重定向
  // const { user } = useAuth();
  // if (user) {
  //    return <Redirect href="/social/(home)" />;
  // } else {
  //    return <Redirect href="/social/(auth)/login" />;
  // }
}
