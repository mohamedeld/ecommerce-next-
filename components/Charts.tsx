
'use client';

import {ResponsiveContainer,BarChart,XAxis,YAxis,Bar} from "recharts"
type TProps = {
  data:{
    salesData:{
      month:string;
      totalSales:number
    }[]
  }
}

const Charts = ({data}:TProps) => {
  return (
    <ResponsiveContainer width={"100%"} height={350}>
      <BarChart data={data?.salesData}>
        <XAxis
          dataKey={"month"}
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value)=> `$${value}`}
        />
        <Bar
          dataKey={'totalSales'}
          fill="currentColor"
          radius={[40,40,0,0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default Charts