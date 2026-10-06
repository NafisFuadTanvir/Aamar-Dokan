import { redirect } from "next/navigation";

// Category system has been removed — redirect to products
export default function CategoriesPage() {
  redirect("/products");
}
