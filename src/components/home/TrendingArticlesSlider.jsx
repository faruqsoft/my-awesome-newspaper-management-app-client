import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import '../../styles/swiper-custom.css' // Your custom Swiper styles
import { fetchTrendingArticles } from '../../services/articleApi';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TrendingArticlesSlider = () => {
    useGSAP(() => {
        gsap.from('.trending-title', { opacity: 0, y: 50, duration: 1, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.trending-title',
                start: 'top 80%',
            }
        });
        gsap.from('.trending-slide', { opacity: 0, y: 50, stagger: 0.1, duration: 0.8, ease: 'power2.out',
            scrollTrigger: {
                trigger: '.swiper-container',
                start: 'top 75%',
            }
        });
    }, []);

    const { data: trendingArticles = [], isLoading, isError, error } = useQuery({
        queryKey: ['trendingArticles'],
        queryFn: fetchTrendingArticles,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    if (isLoading) {
        return <div className="text-center py-16 text-xl text-gray-700">Loading trending articles...</div>;
    }

    if (isError) {
        return <div className="text-center py-16 text-xl text-red-600">Error loading trending articles: {error.message}</div>;
    }

    return (
        <section className="py-16 px-4 md:px-8 bg-white">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 trending-title">🔥 Trending Articles</h2>
                {trendingArticles.length > 0 ? (
                    <Swiper
                        slidesPerView={1}
                        spaceBetween={30}
                        autoplay={{
                            delay: 3500,
                            disableOnInteraction: false,
                        }}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true,
                        }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        className="mySwiper"
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                            },
                            1024: {
                                slidesPerView: 3,
                            },
                        }}
                    >
                        {trendingArticles.map((article) => (
                            <SwiperSlide key={article._id} className="trending-slide">
                                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 border border-gray-100 h-full flex flex-col">
                                    <img src={article.image} alt={article.title} className="w-full h-56 object-cover object-center border-b border-gray-200" />
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2">{article.title}</h3>
                                        <div className="flex items-center text-sm text-gray-600 mb-4">
                                            <img src={article.publisherLogo} alt={article.publisher} className="w-6 h-6 rounded-full mr-2 border border-gray-200" />
                                            <span className="font-medium">{article.publisher}</span>
                                            <span className="mx-2">•</span>
                                            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-700 text-base mb-5 line-clamp-3 flex-grow">{article.description}</p>
                                        <Link to={`/articles/${article._id}`} className="block mt-auto">
                                            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-base hover:bg-blue-700 transition duration-300 transform hover:scale-105">
                                                Read Full Article
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <p className="text-center text-gray-600 text-lg">No trending articles available at the moment.</p>
                )}
            </div>
        </section>
    );
};

export default TrendingArticlesSlider;