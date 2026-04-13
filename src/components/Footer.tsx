import { FiHeart } from "react-icons/fi";
import AppLink from "./ui/AppLink";
import { site } from "@/config/site";

export default function Footer() {
  return (
    <footer className="border-divider mt-8 border-t py-6">
      <div className="mx-auto max-w-[90dvw]">
        <div className="flex items-center justify-center">
          <p className="text-muted text-sm">
            Made with <FiHeart className="text-danger inline size-4" /> by{" "}
            <AppLink
              href={site.author}
              target="_blank"
              rel="noopener noreferrer"
            >
              Md Mojahid
            </AppLink>
          </p>
        </div>
      </div>
    </footer>
  );
}
