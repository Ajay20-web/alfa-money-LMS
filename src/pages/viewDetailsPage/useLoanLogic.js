import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchLoanById, addPayment } from "../../api/loans";

/* --- 1. LOGIC HOOK --- */
export function useLoanLogic() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Track Online Status
  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  // Fetch Data
  const {
    data: loan,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["loan", id],
    queryFn: () => fetchLoanById(id),
  });

  // Mutation (Add Payment)
  const mutation = useMutation({
    mutationFn: addPayment,
    onSuccess: () => {
      alert("Payment Added Successfully!");
      queryClient.invalidateQueries({ queryKey: ["loan", id] });
    },
    onError: (error) => {
      const message =
        typeof error?.message === "string" ? error.message : "";
      const isNetworkError =
        message.toLowerCase().includes("offline") || !navigator.onLine;
      alert(
        isNetworkError
          ? "Network Error: You seem to be offline."
          : message || "Failed to add payment."
      );
    },
  });

  return { id, loan, isLoading, isError, isOnline, mutation };
}

