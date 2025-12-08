import { Button } from "@mui/material";
import Image from "next/image";
import Link from "../components/Link";

export default function Home() {
  return (
    <div>
      <Button component={Link} href="/kanban" variant="contained">
        Go to Kanban Page
      </Button>
    </div>
  );
}
