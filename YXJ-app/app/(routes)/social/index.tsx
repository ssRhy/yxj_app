import { Redirect } from 'expo-router';
import { useAuth } from './providers/AuthProvider';

export default function SocialScreen() {
   const { user } = useAuth();
   
   if (user) {
      return <Redirect href="/social/(home)" />;
   } else {
      return <Redirect href="/social/(auth)/login" />;
   }
}