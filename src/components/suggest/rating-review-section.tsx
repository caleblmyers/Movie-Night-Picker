"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Edit, Trash2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/utils/api-client";
import { logError } from "@/lib/utils/error-handler";

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
  const [editingRating, setEditingRating] = useState(false);

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
      const [ratingData, reviewData] = await Promise.all([
        apiGet<{ rating: { value: number } | null }>("/api/ratings", {
          tmdbId: tmdbId.toString(),
        }),
        apiGet<{ review: { content: string } | null }>("/api/reviews", {
          tmdbId: tmdbId.toString(),
        }),
      ]);

      if (ratingData.rating?.value) {
        setRating(ratingData.rating.value);
      }

      if (reviewData.review?.content) {
        setReview(reviewData.review.content);
        setExistingReview(reviewData.review.content);
      }
    } catch (error) {
      logError(error, "RatingReviewSection.fetchRatingAndReview");
    } finally {
      setFetching(false);
    }
  };

  const handleSaveRating = async () => {
    if (!session?.user?.id || !rating) return;

    setLoading(true);
    try {
      await apiPost("/api/ratings", { tmdbId, rating });
    } catch (error) {
      logError(error, "RatingReviewSection.handleSaveRating");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReview = async () => {
    if (!session?.user?.id || !review.trim()) return;

    setLoading(true);
    try {
      if (existingReview) {
        await apiPut("/api/reviews", { tmdbId, content: review });
      } else {
        await apiPost("/api/reviews", { tmdbId, content: review });
      }
      setExistingReview(review);
      setEditingReview(false);
      // When review is saved, rating becomes read-only
      setEditingRating(false);
    } catch (error) {
      logError(error, "RatingReviewSection.handleSaveReview");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      await apiDelete("/api/reviews", { tmdbId: tmdbId.toString() });
      setReview("");
      setExistingReview("");
      setEditingReview(false);
      // When review is deleted, rating becomes editable again
      setEditingRating(false);
    } catch (error) {
      logError(error, "RatingReviewSection.handleDeleteReview");
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

  const hasReview = !!existingReview;
  const isRatingReadOnly = hasReview && !editingRating;

  return (
    <div className="pt-4 border-t space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center gap-2">
          <Star className="h-4 w-4" />
          Your Rating (1-10)
        </label>
        {isRatingReadOnly ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
              <span className="text-sm font-semibold">
                {rating || "Not rated"} {rating ? "/ 10" : ""}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingRating(true)}
                disabled={loading}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Rating
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Slider
              value={[rating || 5]}
              onValueChange={(value) => setRating(value[0])}
              min={1}
              max={10}
              step={1}
              className="w-full"
              disabled={loading}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {rating || 5} / 10
              </span>
              <div className="flex gap-2">
                {editingRating && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingRating(false);
                      // Reset to original rating if available
                      fetchRatingAndReview();
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={async () => {
                    await handleSaveRating();
                    if (hasReview) {
                      setEditingRating(false);
                    }
                  }}
                  disabled={loading || !rating}
                >
                  {editingRating ? "Update Rating" : "Save Rating"}
                </Button>
              </div>
            </div>
          </div>
        )}
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

