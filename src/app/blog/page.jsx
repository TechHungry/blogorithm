// import './style.css'
import Navbar from '@/components/Header';
import Column from '@/components/Column/Column';

export function blog_slug(title) {
	return title.replace(/\s+/g, '-').toLowerCase();
}

export default function Blog() {
	return (
		<main>
			<Navbar />
			<Column >
				<div className='relative px-4 sm:px-8 lg:px-12'>
					<div className='mx-auto mx-w-2xl lg:max-w-5xl'>
						<h1 className="text-4xl text-center">ARFATH AHMED SYED</h1>
					</div>
				</div>
			</Column>
		</main>
	);
}
