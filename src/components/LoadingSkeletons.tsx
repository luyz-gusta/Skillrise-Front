import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const TrilhaCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border-border">
      {/* Image skeleton */}
      <Skeleton className="aspect-video w-full" />

      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" /> {/* Badge */}
          <Skeleton className="h-6 w-3/4" /> {/* Title */}
          <Skeleton className="h-4 w-full" /> {/* Description line 1 */}
          <Skeleton className="h-4 w-2/3" /> {/* Description line 2 */}
        </div>

        <div className="flex items-center gap-4 pt-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>

        <Skeleton className="h-10 w-full" /> {/* Button */}
      </div>
    </Card>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header skeleton */}
          <div className="mb-12 space-y-2">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>

          {/* Stats grid skeleton */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 border-border">
                <div className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Main content skeleton */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="p-8 border-border">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                  <div className="grid grid-cols-3 gap-6 pt-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i}>
                        <Skeleton className="h-8 w-16 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            <div className="space-y-8">
              <div>
                <Skeleton className="h-6 w-48 mb-4" />
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-4 border-border mb-3">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PerfilSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Profile header skeleton */}
          <Card className="mb-12 p-8 border-border">
            <div className="flex gap-6 items-center">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-64" />
                <div className="flex gap-6">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </Card>

          {/* Main content skeleton */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="grid md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="p-6 border-border">
                      <div className="flex items-start gap-4">
                        <Skeleton className="w-12 h-12 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Skeleton className="h-8 w-48 mb-6" />
              <Card className="p-6 border-border">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="mb-6 last:mb-0">
                    <div className="flex justify-between mb-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
