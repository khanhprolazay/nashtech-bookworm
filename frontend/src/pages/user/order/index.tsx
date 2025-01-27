/** @format */

import useSession from '@/hooks/use-session.hook';
import Layout from '../_components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TypographyP } from '@/components/ui/typography';
import { IOrder } from '@/interfaces/user.interface';

export default function OrderPage() {
	const { user } = useSession();

	const caculateTotal = (order: IOrder) => {
		return order.books.reduce((acc, book) => {
			return acc + book.price * (100 - book.discount) / 100 * book.quantity;
		} , 0);
	}

	const getVariant = (status: string) => {
		switch (status) {
			case 'PENDING':
				return 'warning';
			case 'PROCESSING':
				return 'success';
			case 'SHIPPING':
				return 'success';
			case 'DELIVERED':
				return 'success';
			case 'CANCELLED':
				return 'destructive';
			default:
				return 'default';
		}
	}

	return (
		<Layout>
			<div className="col-span-10 flex flex-col gap-4">
				{user?.orders.map((order) => (
					<Card key={order.id}>
						<CardContent className='py-6'>
							<div className="flex justify-between items-center">
								<div>
								<TypographyP className='text-sm'>Order ID: {order.id}</TypographyP>
								<TypographyP className='text-sm'>Total: {caculateTotal(order)} $</TypographyP>
								</div>
								<Badge variant={getVariant(order.status)} className='text-slate-100'>{order.status}</Badge>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</Layout>
	);
}
