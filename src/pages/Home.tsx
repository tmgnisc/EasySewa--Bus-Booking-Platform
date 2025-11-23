import { useEffect, useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { SearchWidget } from '@/components/booking/SearchWidget';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, Shield, Clock, Star, Loader2 } from 'lucide-react';
import { dummyRoutes, dummyTestimonials } from '@/data/dummyData';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

const Home = () => {
  const [buses, setBuses] = useState<any[]>([]);
  const [isLoadingBuses, setIsLoadingBuses] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await api.bus.getAll();
        setBuses(response.buses || []);
      } catch (error) {
        console.error('Error fetching buses:', error);
        // Don't show error on home page, just use empty array
      } finally {
        setIsLoadingBuses(false);
      }
    };

    fetchBuses();
  }, []);
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center text-primary-foreground">
            <Badge className="mb-4 bg-accent text-accent-foreground">India's #1 Bus Booking Platform</Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight lg:text-6xl">
              Travel Smarter with EasySewa
            </h1>
            <p className="mb-8 text-lg opacity-90 lg:text-xl">
              Book comfortable and affordable bus tickets across India. Safe, reliable, and hassle-free travel experience.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/search">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto !text-foreground">
                  Book Your Ticket
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground !text-primary-foreground hover:bg-primary-foreground hover:!text-primary">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Widget Section */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <SearchWidget />
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose EasySewa?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience seamless bus booking with the most trusted platform in India
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Shield,
                title: 'Safe & Secure',
                description: 'Your data and payments are protected with industry-standard security',
              },
              {
                icon: CheckCircle,
                title: 'Verified Buses',
                description: 'All buses are verified and meet our quality standards',
              },
              {
                icon: Clock,
                title: '24/7 Support',
                description: 'Round-the-clock customer support for any assistance',
              },
              {
                icon: Star,
                title: 'Best Prices',
                description: 'Get the best deals and offers on bus tickets',
              },
            ].map((feature, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Available Buses */}
      {buses.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Available Buses</h2>
              <p className="text-muted-foreground">Browse our fleet of comfortable buses</p>
            </div>

            {isLoadingBuses ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {buses.slice(0, 6).map((bus) => (
                  <Card key={bus.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {bus.images && bus.images.length > 0 ? (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={bus.images[0]}
                          alt={bus.busName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20" />
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg">{bus.busName}</h3>
                          <p className="text-sm text-muted-foreground">{bus.busNumber}</p>
                        </div>
                        <Badge variant="secondary">{bus.busType}</Badge>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="text-sm font-medium">{bus.rating || '0.0'}</span>
                      </div>
                      {bus.amenities && bus.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {bus.amenities.slice(0, 3).map((amenity: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {bus.amenities.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{bus.amenities.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      <Link to="/search">
                        <Button variant="link" className="px-0 mt-2">
                          View Schedules <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Popular Routes */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Popular Routes</h2>
            <p className="text-muted-foreground">Explore our most traveled destinations</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {dummyRoutes.map((route) => (
              <Card key={route.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20" />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1">
                    {route.from} → {route.to}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {route.popularityScore}% travelers choose this route
                  </p>
                  <Link to={`/search?from=${route.from}&to=${route.to}`}>
                    <Button variant="link" className="px-0 mt-2">
                      View Buses <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground">Real experiences from real travelers</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {dummyTestimonials.map((testimonial) => (
              <Card key={testimonial.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent" />
                    <div>
                      <h4 className="font-semibold">{testimonial.userName}</h4>
                      <div className="flex gap-0.5">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{testimonial.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of happy travelers who trust EasySewa for their bus booking needs
          </p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="!text-foreground">
              Sign Up Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
