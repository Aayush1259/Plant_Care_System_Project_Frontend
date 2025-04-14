
// Reexport the toast hook from radix ui toast
import { useToast as useRadixToast } from "@/components/ui/toast";

export const useToast = useRadixToast;
export { toast } from "@/components/ui/toast";
