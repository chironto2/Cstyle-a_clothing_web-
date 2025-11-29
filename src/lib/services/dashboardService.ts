import { connectToDatabase } from '@/lib/mongodb';
import type { OrderDoc, DbUser } from '@/types'; // Assuming OrderDoc and DbUser are your database types

export interface MonthlySalesData {
  name: string; // For XAxis dataKey, e.g., "Jan '24"
  sales: number; // For Bar dataKey
}

export interface DashboardMetrics {
  totalSales: number;
  completedOrdersCount: number;
  activeOrdersCount: number;
  totalUsersCount: number;
  ordersThisMonthCount: number;
  salesThisMonth: number;
  salesLastMonth: number;
  salesGrowthPercentage: number;
  monthlySalesChartData: MonthlySalesData[];
}

export async function getDashboardAnalytics(): Promise<DashboardMetrics> {
  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection<OrderDoc>('orders');
    const usersCollection = db.collection<DbUser>('users');

    const today = new Date();
    const firstDayCurrentMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );
    const firstDayLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    const firstDayNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );
    const chartStartDate = new Date(
      today.getFullYear(),
      today.getMonth() - 2,
      1
    );

    // Single aggregation pipeline for all order metrics
    const orderMetrics = await ordersCollection
      .aggregate([
        {
          $facet: {
            totalSales: [
              { $match: { orderStatus: 'Delivered' } },
              { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ],
            completedCount: [
              { $match: { orderStatus: 'Delivered' } },
              { $count: 'count' },
            ],
            activeCount: [
              { $match: { orderStatus: { $in: ['Pending', 'Processing'] } } },
              { $count: 'count' },
            ],
            thisMonthMetrics: [
              {
                $match: {
                  createdAt: {
                    $gte: firstDayCurrentMonth,
                    $lt: firstDayNextMonth,
                  },
                },
              },
              {
                $group: {
                  _id: null,
                  count: { $sum: 1 },
                  sales: {
                    $sum: {
                      $cond: [
                        { $eq: ['$orderStatus', 'Delivered'] },
                        '$totalAmount',
                        0,
                      ],
                    },
                  },
                },
              },
            ],
            lastMonthSales: [
              {
                $match: {
                  orderStatus: 'Delivered',
                  createdAt: {
                    $gte: firstDayLastMonth,
                    $lt: firstDayCurrentMonth,
                  },
                },
              },
              { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ],
            chartData: [
              {
                $match: {
                  orderStatus: 'Delivered',
                  createdAt: { $gte: chartStartDate, $lt: firstDayNextMonth },
                },
              },
              {
                $group: {
                  _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                  },
                  totalSales: { $sum: '$totalAmount' },
                },
              },
              { $sort: { '_id.year': 1, '_id.month': 1 } },
            ],
          },
        },
      ])
      .toArray();

    const metrics = orderMetrics[0];
    const totalSales = metrics.totalSales[0]?.total || 0;
    const completedOrdersCount = metrics.completedCount[0]?.count || 0;
    const activeOrdersCount = metrics.activeCount[0]?.count || 0;
    const ordersThisMonthCount = metrics.thisMonthMetrics[0]?.count || 0;
    const salesThisMonth = metrics.thisMonthMetrics[0]?.sales || 0;
    const salesLastMonth = metrics.lastMonthSales[0]?.total || 0;

    const totalUsersCount = await usersCollection.countDocuments();

    let salesGrowthPercentage = 0;
    if (salesLastMonth > 0) {
      salesGrowthPercentage =
        ((salesThisMonth - salesLastMonth) / salesLastMonth) * 100;
    } else if (salesThisMonth > 0) {
      salesGrowthPercentage = 100;
    }

    const monthMap = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthlySalesChartData: MonthlySalesData[] = [];
    const N_MONTHS_FOR_CHART = 3;

    for (let i = 0; i < N_MONTHS_FOR_CHART; i++) {
      const targetMonthDate = new Date(
        today.getFullYear(),
        today.getMonth() - i,
        1
      );
      const year = targetMonthDate.getFullYear();
      const monthIndex = targetMonthDate.getMonth();

      const monthName = `${monthMap[monthIndex]} '${String(year).slice(-2)}`;

      const foundSale = metrics.chartData.find(
        (sale: any) =>
          sale._id.year === year && sale._id.month === monthIndex + 1
      );

      monthlySalesChartData.push({
        name: monthName,
        sales: foundSale ? foundSale.totalSales : 0,
      });
    }
    monthlySalesChartData.reverse();

    return {
      totalSales,
      completedOrdersCount,
      activeOrdersCount,
      totalUsersCount,
      ordersThisMonthCount,
      salesThisMonth,
      salesLastMonth,
      salesGrowthPercentage,
      monthlySalesChartData,
    };
  } catch (error: any) {
    console.error(
      '[dashboardService] Error in getDashboardAnalytics:',
      error.message
    );
    return {
      totalSales: 0,
      completedOrdersCount: 0,
      activeOrdersCount: 0,
      totalUsersCount: 0,
      ordersThisMonthCount: 0,
      salesThisMonth: 0,
      salesLastMonth: 0,
      salesGrowthPercentage: 0,
      monthlySalesChartData: Array(3)
        .fill(null)
        .map((_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - (2 - i));
          const monthMap = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ];
          return {
            name: `${monthMap[d.getMonth()]} '${String(d.getFullYear()).slice(
              -2
            )}`,
            sales: 0,
          };
        }),
    };
  }
}
