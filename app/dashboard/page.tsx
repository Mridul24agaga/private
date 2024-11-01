"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Home, FileText, DollarSign, ChevronDown } from 'lucide-react'
import { cn } from "@/libs/utils"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

// Table components (unchanged)
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

interface FinancialData {
  income: number
  expenses: number
  netProfit: number
  grossProfitMargin: number
  monthlyIncome: number[]
  quarterlyIncome: number[]
  cashInflows: number
  cashToHand: number
  clients: { name: string; amount: number; dueDate: string }[]
  payroll: { department: string; amount: number; payDate: string }[]
}

interface DataInputProps {
  financialData: FinancialData
  onInputChange: (newData: FinancialData) => void
  onViewDashboard: () => void
}

const DataInput: React.FC<DataInputProps> = ({ financialData, onInputChange, onViewDashboard }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof FinancialData) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value
    onInputChange({ ...financialData, [field]: value })
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold">Financial Data Input</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="income" className="block text-sm font-medium text-gray-700">Income</label>
          <input
            type="number"
            id="income"
            value={financialData.income}
            onChange={(e) => handleChange(e, 'income')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="expenses" className="block text-sm font-medium text-gray-700">Expenses</label>
          <input
            type="number"
            id="expenses"
            value={financialData.expenses}
            onChange={(e) => handleChange(e, 'expenses')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
      </div>
      {/* Add more input fields for other financial data here */}
      <button
        onClick={onViewDashboard}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        View Dashboard
      </button>
    </div>
  )
}

export default function FinancialDashboard() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<'dashboard' | 'dataInput'>('dashboard')
  const [financialData, setFinancialData] = useState<FinancialData>({
    income: 0,
    expenses: 0,
    netProfit: 0,
    grossProfitMargin: 0,
    monthlyIncome: [0, 0, 0, 0, 0, 0],
    quarterlyIncome: [0, 0],
    cashInflows: 0,
    cashToHand: 0,
    clients: [
      { name: '', amount: 0, dueDate: '' },
      { name: '', amount: 0, dueDate: '' },
      { name: '', amount: 0, dueDate: '' },
    ],
    payroll: [
      { department: '', amount: 0, payDate: '' },
      { department: '', amount: 0, payDate: '' },
      { department: '', amount: 0, payDate: '' },
    ]
  })

  const handleInputChange = (newData: FinancialData) => {
    setFinancialData(newData)
  }

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  const toggleView = (view: 'dashboard' | 'dataInput') => {
    setActiveView(view)
  }

  const incomeVsExpensesData = {
    labels: ['Income', 'Expenses', 'Net Profit'],
    datasets: [{
      data: [financialData.income, financialData.expenses, financialData.netProfit],
      backgroundColor: ['#8FD14F', '#FDA4AF', '#0EA5E9'],
    }]
  }

  const monthlyIncomeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Monthly Income',
      data: financialData.monthlyIncome,
      borderColor: '#8FD14F',
      backgroundColor: '#8FD14F',
    }]
  }

  return (
    <div className="flex h-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-[#111827] text-white p-6"
      >
        <h1 className="text-2xl font-bold mb-6">Connect Chatting LLC</h1>
        <nav className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center w-full py-2 px-4 rounded hover:bg-gray-700"
            onClick={() => toggleView('dashboard')}
          >
            <Home className="mr-2" size={18} /> Dashboard
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center w-full py-2 px-4 rounded hover:bg-gray-700"
            onClick={() => toggleView('dataInput')}
          >
            <FileText className="mr-2" size={18} /> Data Input
          </motion.button>
          <div>
            <motion.button
              className="flex items-center justify-between w-full py-2 px-4 rounded hover:bg-gray-700"
              onClick={() => toggleDropdown('salesData')}
            >
              <span className="flex items-center"><DollarSign className="mr-2" size={18} /> Sales Data</span>
              
              <motion.div
                animate={{ rotate: openDropdown === 'salesData' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={18} />
              </motion.div>
            </motion.button>
            <AnimatePresence>
              {openDropdown === 'salesData' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pl-6 mt-2 space-y-2 overflow-hidden"
                >
                  <button className="block w-full text-left py-2 px-4 rounded hover:bg-gray-700">
                    Form
                  </button>
                  <button className="block w-full text-left py-2 px-4 rounded hover:bg-gray-700">
                    Pay Period
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 p-8 overflow-auto"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold mb-6"
          >
            {activeView === 'dashboard' ? 'Financial Dashboard' : 'Data Input'}
          </motion.h2>
          
          {activeView === 'dataInput' ? (
            <DataInput 
              financialData={financialData}
              onInputChange={handleInputChange}
              onViewDashboard={() => toggleView('dashboard')}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-12 gap-6"
            >
              {/* Income & Expenses Overview */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="col-span-4 bg-white p-6 rounded-lg shadow"
              >
                <h3 className="text-xl font-bold mb-4">Income & Expenses Overview</h3>
                <Doughnut data={incomeVsExpensesData} />
              </motion.div>

              {/* Monthly Income Summary */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="col-span-4 bg-white p-6 rounded-lg shadow"
              >
                <h3 className="text-xl font-bold mb-4">Monthly Income Summary</h3>
                <Bar data={monthlyIncomeData} />
              </motion.div>

              {/* Key Financial Metrics */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="col-span-4 bg-white p-6 rounded-lg shadow"
              >
                <h3 className="text-xl font-bold mb-4">Key Financial Metrics</h3>
                <p><strong>Total Income:</strong> ${financialData.income.toLocaleString()}</p>
                <p><strong>Total Expenses:</strong> ${financialData.expenses.toLocaleString()}</p>
                <p><strong>Net Profit:</strong> ${financialData.netProfit.toLocaleString()}</p>
                <p><strong>Gross Profit Margin:</strong> {financialData.grossProfitMargin.toFixed(2)}%</p>
              </motion.div>

              {/* Quarterly Report */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="col-span-6 bg-white p-6 rounded-lg shadow"
              >
                <h3 className="text-xl font-bold mb-4">Quarterly Report</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Q1 Income</h4>
                    <p className="text-2xl">${financialData.quarterlyIncome[0].toLocaleString()}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Q2 Income</h4>
                    <p className="text-2xl">${financialData.quarterlyIncome[1].toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>

              {/* Cash Flow Insights */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="col-span-6 bg-purple-100 p-6 rounded-lg shadow"
              >
                <h3 className="text-xl font-bold mb-2">Cash Flow Insights</h3>
                <p className="mb-2"><strong>Cash Inflows:</strong> ${financialData.cashInflows.toLocaleString()}</p>
                
                <p className="mb-2"><strong>Cash To Hand:</strong> ${financialData.cashToHand.toLocaleString()}</p>
                <p className="text-sm">
                  {financialData.cashInflows > financialData.expenses 
                    ? "Current cash flow is positive. Consider reinvesting in growth areas or improving efficiency to increase profitability further."
                    : "Cash flow is negative. Review expenses and consider ways to increase income or reduce costs."}
                </p>
              </motion.div>

              {/* Payroll & Client Payments Schedule */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="col-span-12 bg-white p-6 rounded-lg shadow"
              >
                <h3 className="text-xl font-bold mb-4">Payroll & Client Payments Schedule</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financialData.payroll.map((item, index) => (
                      <TableRow key={`payroll-${index}`}>
                        <TableCell>{item.department} Payroll</TableCell>
                        <TableCell>${item.amount.toLocaleString()}</TableCell>
                        <TableCell>{item.payDate}</TableCell>
                      </TableRow>
                    ))}
                    {financialData.clients.map((client, index) => (
                      <TableRow key={`client-${index}`}>
                        <TableCell>{client.name} Payment</TableCell>
                        <TableCell>${client.amount.toLocaleString()}</TableCell>
                        <TableCell>{client.dueDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}