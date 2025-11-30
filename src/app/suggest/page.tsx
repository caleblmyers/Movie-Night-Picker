"use client";

import { useEffect, useState, useRef } from "react";
import { useQuery } from "@apollo/client/react";
import { useRouter, usePathname } from "next/navigation";
import { MovieSelectionRound } from "@/components/suggest/movie-selection-round";
import { MovieResultDisplay } from "@/components/suggest/movie-result";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { SUGGEST_MOVIE } from "@/lib/graphql";
import { MovieResult } from "@/types/suggest";
import { useSuggestFlow } from "@/hooks/use-suggest-flow";
import { useRoundMovies } from "@/hooks/use-round-movies";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const RESET_SUGGEST_FLOW_EVENT = "reset-suggest-flow";

export default function SuggestPage() {
  const {
    currentRound,
    selectedMovieIds,
    handleSelect,
    handleReset,
    TOTAL_ROUNDS,
    isComplete,
  } = useSuggestFlow();

  const { movies, loading: loadingMovies, error: moviesError, refetch } = useRoundMovies(
    currentRound
  );

  const router = useRouter();
  const pathname = usePathname();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const navigationConfirmedRef = useRef(false);

  // Listen for reset event from navbar
  useEffect(() => {
    const handleResetEvent = () => {
      handleReset();
    };

    window.addEventListener(RESET_SUGGEST_FLOW_EVENT, handleResetEvent);
    return () => {
      window.removeEventListener(RESET_SUGGEST_FLOW_EVENT, handleResetEvent);
    };
  }, [handleReset]);

  // Handle browser navigation (back/forward, closing tab, etc.)
  useEffect(() => {
    if (isComplete) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
      return "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isComplete]);

  // Intercept Next.js router navigation via link clicks
  useEffect(() => {
    if (isComplete) return;

    const handleClick = (e: MouseEvent) => {
      // If navigation is already confirmed, allow it
      if (navigationConfirmedRef.current) {
        navigationConfirmedRef.current = false;
        return;
      }

      const target = e.target as HTMLElement;
      const link = target.closest("a");
      
      if (!link) return;
      
      // Get href from various possible attributes
      const href = link.getAttribute("href") || 
                   link.getAttribute("data-href") ||
                   (link as HTMLAnchorElement).href?.replace(window.location.origin, "");
      
      if (!href) return;
      
      // Ignore if clicking on the same page
      const normalizedHref = href.split("?")[0].split("#")[0];
      const normalizedPathname = pathname.split("?")[0].split("#")[0];
      if (normalizedHref === normalizedPathname) {
        return;
      }

      // Ignore external links and special protocols
      if (href.startsWith("http://") || 
          href.startsWith("https://") || 
          href.startsWith("mailto:") || 
          href.startsWith("tel:") ||
          href.startsWith("#")) {
        return;
      }

      // Show confirmation dialog
      e.preventDefault();
      e.stopPropagation();
      setPendingNavigation(normalizedHref);
      setShowConfirmDialog(true);
    };

    // Use capture phase to intercept before Next.js Link handles it
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [isComplete, pathname]);

  // Note: Programmatic navigation (router.push) is harder to intercept reliably
  // The link click interception and beforeunload should cover most cases

  const handleConfirmNavigation = () => {
    navigationConfirmedRef.current = true;
    setShowConfirmDialog(false);
    
    if (pendingNavigation) {
      handleReset();
      router.push(pendingNavigation);
    }
    
    setPendingNavigation(null);
  };

  const handleCancelNavigation = () => {
    setShowConfirmDialog(false);
    setPendingNavigation(null);
  };

  // Render confirmation dialog (only show when flow is not complete)
  const renderConfirmDialog = () => {
    if (isComplete) return null;
    
    return (
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Flow?</DialogTitle>
            <DialogDescription>
              Navigating away will reset your current progress. Are you sure you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelNavigation}>
              Cancel
            </Button>
            <Button onClick={handleConfirmNavigation}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  // Only call suggestMovie after all rounds are completed
  const { data, loading, error } = useQuery<{ suggestMovie: MovieResult }>(
    SUGGEST_MOVIE,
    {
      variables: { 
        selectedMovieIds 
      },
      skip: !isComplete || selectedMovieIds.length === 0, // Only query when all rounds are complete
      fetchPolicy: "network-only", // Always fetch fresh results
      errorPolicy: "all", // Continue rendering even on error
    }
  );

  // Show final result when all rounds are complete and query completes
  if (isComplete && loading) {
    return (
      <>
        <LoadingState
          message="Finding your perfect movie..."
          submessage="Please wait"
        />
        {renderConfirmDialog()}
      </>
    );
  }

  if (isComplete && error) {
    return (
      <>
        <ErrorState
          message={
            error.message || "Failed to fetch movie suggestion. Please try again."
          }
          onRetry={handleReset}
          retryLabel="Start Over"
        />
        {renderConfirmDialog()}
      </>
    );
  }

  if (isComplete && data?.suggestMovie) {
    return <MovieResultDisplay movie={data.suggestMovie} />;
  }

  // Show error if round movies fail to load
  if (moviesError && currentRound <= TOTAL_ROUNDS) {
    return (
      <>
        <ErrorState
          message={
            moviesError.message || "Failed to load movies for this round. Please try again."
          }
          onRetry={() => refetch()}
          retryLabel="Retry"
        />
        {renderConfirmDialog()}
      </>
    );
  }

  // Show movie selection round
  if (currentRound <= TOTAL_ROUNDS) {
    return (
      <>
        <MovieSelectionRound
          round={currentRound}
          totalRounds={TOTAL_ROUNDS}
          movies={movies}
          onSelect={handleSelect}
          onRefresh={() => refetch()}
          loading={loadingMovies}
        />
        {renderConfirmDialog()}
      </>
    );
  }

  return (
    <>
      <LoadingState />
      {renderConfirmDialog()}
    </>
  );
}
