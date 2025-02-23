import React from 'react'
import { useEffect } from "react";

import CategoryItem from "../components/CategoryItem";
import intelCpuimg from "../assets/i5cpu.jpg"
import moboimg from "../assets/mobo.png"
import ram from "../assets/RAM.png"
import monitor from "../assets/monitor.png"
import keyboard from "../assets/keyboard.png"
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";


const categories = [
	{ href: "/CPUs", name: "intelcpus", imageUrl: intelCpuimg },
	{ href: "/motherboards", name: "Motherboards", imageUrl: moboimg },
	{ href: "/RAMs", name: "RAM", imageUrl: ram },
	{ href: "/monitors", name: "monitors", imageUrl: monitor },
	{ href: "/Keyboards", name: "Keyboards", imageUrl: keyboard	 },
];

const HomePage = () => {
	const { fetchFeaturedProducts, products, isLoading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Explore cutting edge components
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					New in town
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
			</div>
		</div>
	);
};
export default HomePage;