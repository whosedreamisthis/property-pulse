import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/initials";

interface UserAvatarProps {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export default function UserAvatar({ name, email, image }: UserAvatarProps) {
  return (
    <Avatar size="lg">
      {image && (
        // Google avatars block hotlinking with a referrer, so don't send one.
        <AvatarImage src={image} alt="" referrerPolicy="no-referrer" />
      )}
      <AvatarFallback className="bg-primary-100 font-semibold text-primary-700">
        {getInitials(name, email)}
      </AvatarFallback>
    </Avatar>
  );
}
