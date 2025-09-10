"use client";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

const fakeTests = [
	{
		id: 1,
		title: "Math Mastery Quiz",
		description: "Sharpen your math skills with this challenging test.",
		icon: "/file.svg",
		tags: ["math", "numbers"],
	},
	{
		id: 2,
		title: "History Challenge",
		description: "Test your knowledge of world history.",
		icon: "/globe.svg",
		tags: ["history", "world"],
	},
	{
		id: 3,
		title: "Science Explorer",
		description: "Explore the wonders of science with this quiz.",
		icon: "/window.svg",
		tags: ["science", "biology", "chemistry"],
	},
	{
		id: 4,
		title: "Literature Insight",
		description: "Dive into classic and modern literature questions.",
		icon: "/file.svg",
		tags: ["literature", "books"],
	},
];

export default function TestsPage() {
	const [search, setSearch] = useState("");

	const filteredTests = fakeTests.filter(
		(test) =>
			test.title.toLowerCase().includes(search.toLowerCase()) ||
			test.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))
	);

	return (
		<div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-white transition-colors duration-300 p-8 pb-20 font-sans flex flex-col items-center">
			<h1 className="text-2xl font-bold mb-4 text-center">Available Tests</h1>
			<div className="w-full max-w-3xl mb-6 flex items-center justify-center">
				<Input
					type="text"
					placeholder="Search by title or subject/tag..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-400 shadow"
				/>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
				{filteredTests.length === 0 ? (
					<div className="col-span-2 text-center opacity-60 py-12">No tests found.</div>
				) : (
					filteredTests.map((test) => (
						<Card
							key={test.id}
							className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col justify-between rounded-xl transition-all duration-200 hover:shadow-md hover:border-zinc-400 dark:hover:border-zinc-400"
						>
							<CardHeader className="flex items-center gap-3 pb-2">
								<div className="flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-800">
									<Image src={test.icon} alt="Test icon" width={24} height={24} className="dark:invert" />
								</div>
								<CardTitle className="text-base font-semibold">{test.title}</CardTitle>
							</CardHeader>
							<CardContent className="pb-2 text-sm opacity-80">
								{test.description}
								<div className="mt-2 flex flex-wrap gap-2">
									{test.tags.map((tag) => (
										<span
											key={tag}
											className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-300"
										>
											{tag}
										</span>
									))}
								</div>
							</CardContent>
							<CardFooter className="pt-2 flex justify-end">
								<Button asChild className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 px-4 py-1.5 rounded-lg text-sm">
									<Link href={`/tests/${test.id}`}>Start Test</Link>
								</Button>
							</CardFooter>
						</Card>
					))
				)}
			</div>
		</div>
	);
}