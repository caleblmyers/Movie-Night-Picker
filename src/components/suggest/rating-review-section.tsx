"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Edit, Trash2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface RatingReviewSectionProps {
  tmdbId: number;
}

export function RatingReviewSection({ tmdbId }: RatingReviewSectionProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState<string>("");
  const [existingReview, setExistingReview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingReview, setEditingReview] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      fetchRatingAndReview();
    } else {
      setFetching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id, tmdbId]);

  const fetchRatingAndReview = async () => {
    try {
      const [ratingRes, reviewRes] = await Promise.all([
        fetch(`/api/ratings?tmdbId=${tmdbId}`),
        fetch(`/api/reviews?tmdbId=${tmdbId}`),
      ]);

      if (ratingRes.ok) {
        const ratingData = await ratingRes.json();
        if (ratingData.rating) {
          setRating(ratingData.rating);
        }
      }

      if (reviewRes.ok) {
        const reviewData = await reviewRes.json();
        if (reviewData.review) {
          setReview(reviewData.review.content);
          setExistingReview(reviewData.review.content);
        }
      }
    } catch (error) {
      console.error("Error fetching rating/review:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleSaveRating = async () => {
    if (!session?.user?.id || !rating) return;

    setLoading(true);
    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tmdbId, rating }),
      });

      if (!response.ok) {
        console.error("Failed to save rating");
      }
    } catch (error) {
      console.error("Error saving rating:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReview = async () => {
    if (!session?.user?.id || !review.trim()) return;

    setLoading(true);
    try {
      const method = existingReview ? "PUT" : "POST";
      const response = await fetch("/api/reviews", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tmdbId, content: review }),
      });

      if (response.ok) {
        setExistingReview(review);
        setEditingReview(false);
      }
    } catch (error) {
      console.error("Error saving review:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/reviews?tmdbId=${tmdbId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setReview("");
        setExistingReview("");
        setEditingReview(false);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="pt-4 border-t text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>{" "}
        to rate and review this movie
      </div>
    );
  }

  if (fetching) {
    return <div className="pt-4 border-t">Loading...</div>;
  }

  return (
    <div className="pt-4 border-t space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Star className="h-4 w-4" />
          Your Rating (1-10)
        </label>
        <div className="space-y-2">
          <Slider
            value={[rating || 5]}
            onValueChange={(value) => setRating(value[0])}
            min={1}
            max={10}
            step={1}
            className="w-full"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {rating || 5} / 10
            </span>
            <Button
              size="sm"
              onClick={handleSaveRating}
              disabled={loading || !rating}
            >
              Save Rating
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Your Review</label>
        {editingReview || !existingReview ? (
          <div className="space-y-2">
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review..."
              className="w-full min-h-[100px] rounded-md border bg-transparent px-3 py-2 text-sm"
              rows={4}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveReview} disabled={loading}>
                {existingReview ? "Update Review" : "Save Review"}
              </Button>
              {existingReview && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setReview(existingReview);
                      setEditingReview(false);
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDeleteReview}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {existingReview}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditingReview(true);
                setReview(existingReview);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Review
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

