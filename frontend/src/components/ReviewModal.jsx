import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import api from "../api/axiosInstance";
import Loading from "./Loading";

const ReviewModal = ({
  isOpen,
  onClose,
  productId,
  orderId,
  productName,
  existingReview,
  onSubmit,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hovered, setHovered] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRating(existingReview?.rating || 0);
      setComment(existingReview?.comment || "");
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsAnimating(true));
      });
    } else {
      setIsAnimating(false);
      const timeout = setTimeout(() => setShouldRender(false), 100);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, existingReview]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post("/api/review/add", {
        productId,
        orderId,
        rating,
        comment: comment.trim(),
      });
      if (response.data.success) {
        toast.success(response.data.message);
        onSubmit();
        onClose();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = () => {
    if (!submitting) onClose();
  };

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-[2px] transition-opacity duration-100 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm bg-white px-7 pt-8 pb-6 shadow-xl transition-all duration-100 sm:max-w-md ${
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="mb-5 flex items-center justify-between">
          <p className="text-lg font-medium text-gray-800">Write a Review</p>
          <button
            onClick={onClose}
            disabled={submitting}
            aria-label="Close review"
            className="cursor-pointer text-gray-400 hover:text-gray-600"
          >
            <Icon icon="solar:close-circle-outline" className="text-2xl" />
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-500">{productName}</p>

        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Rating</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                className="cursor-pointer"
              >
                <Icon
                  icon={
                    star <= (hovered || rating)
                      ? "solar:star-bold"
                      : "solar:star-outline"
                  }
                  className={
                    star <= (hovered || rating)
                      ? "text-amber-400 text-2xl"
                      : "text-gray-300 text-2xl"
                  }
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-2 text-sm font-medium text-gray-700">Comment</p>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
            className="w-full resize-none border border-gray-300 p-3 text-sm focus:border-gray-500 focus:outline-none"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`flex h-10 w-full cursor-pointer items-center justify-center bg-gray-900 text-sm text-white transition-colors hover:bg-gray-800 ${
            submitting ? "cursor-not-allowed opacity-70" : ""
          }`}
        >
          {submitting ? (
            <Loading type="spinner" color="text-gray-100" size="text-xl" />
          ) : existingReview ? (
            "Update Review"
          ) : (
            "Submit Review"
          )}
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default ReviewModal;
