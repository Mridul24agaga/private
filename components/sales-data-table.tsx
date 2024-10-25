"use client"

import React, { useState } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { ChevronDown, Home, Send, Lightbulb, GitBranch, Target, CheckSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { cn } from "../libs/utils"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

// Table components
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={cn("w-full caption-bottom text-sm", className)}
    {...props}
  />
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

// Card components
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

// Input component
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

// Button component
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        "bg-primary text-primary-foreground hover:bg-primary/90",
        "h-10 px-4 py-2",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

// Label component
const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
))
Label.displayName = "Label"

// ScrollArea components
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export default function Dashboard() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null)
  const [financialData, setFinancialData] = useState({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, category: string, index?: number, subCategory?: string) => {
    const { name, value } = e.target
    setFinancialData(prevData => {
      if (category === 'monthlyIncome') {
        const newMonthlyIncome = [...prevData.monthlyIncome]
        newMonthlyIncome[index!] = parseFloat(value) || 0
        return { ...prevData, monthlyIncome: newMonthlyIncome }
      } else if (category === 'quarterlyIncome') {
        const newQuarterlyIncome = [...prevData.quarterlyIncome]
        newQuarterlyIncome[index!] = parseFloat(value) || 0
        return { ...prevData, quarterlyIncome: newQuarterlyIncome }
      } else if (category === 'clients' || category === 'payroll') {
        const newArray = [...prevData[category]]
        newArray[index!] = { ...newArray[index!], [subCategory!]: value }
        return { ...prevData, [category]: newArray }
      } else {
        return { ...prevData, [name]: parseFloat(value) || 0 }
      }
    })
  }

  const calculateFinances = () => {
    const netProfit = financialData.income - financialData.expenses
    const grossProfitMargin = financialData.income !== 0 ? (netProfit / financialData.income) * 100 : 0
    setFinancialData(prevData => ({
      ...prevData,
      netProfit,
      grossProfitMargin
    }))
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

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
    setActiveSubmenu(null)
  }

  const toggleSubmenu = (submenu: string) => {
    setActiveSubmenu(activeSubmenu === submenu ? null : submenu)
  }

  return (
    <div className="flex h-screen bg-gray-100 text-black">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-gray-800 text-white p-6"
      >
        <h1 className="text-2xl font-bold mb-6">Finance Pro</h1>
        <nav className="space-y-2">
          <div>
            <button 
              className="flex items-center justify-between w-full py-2 px-4 rounded hover:bg-gray-700"
              onClick={() => toggleDropdown('home')}
            >
              <span className="flex items-center"><Home className="mr-2" size={18} /> Home</span>
              <motion.div
                animate={{ rotate: openDropdown === 'home' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={18} />
              </motion.div>
            </button>
            <AnimatePresence>
              {openDropdown === 'home' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pl-6 mt-2 space-y-2 overflow-hidden"
                >
                  <button 
                    className="block w-full text-left py-2 px-4 rounded hover:bg-gray-700"
                    onClick={() => toggleSubmenu('dataInput')}
                  >
                    Data Input
                  </button>
                  <button 
                    className="block w-full text-left py-2 px-4 rounded hover:bg-gray-700"
                    onClick={() => toggleSubmenu('dashboard')}
                  >
                    Dashboard
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div>
            <button 
              className="flex items-center justify-between w-full py-2 px-4 rounded hover:bg-gray-700"
              onClick={() => toggleDropdown('launch')}
            >
              <span className="flex items-center"><Send className="mr-2" size={18} /> Launch</span>
              <motion.div
                animate={{ rotate: openDropdown === 'launch' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown size={18} />
              </motion.div>
            </button>
            <AnimatePresence>
              {openDropdown === 'launch' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pl-6 mt-2 space-y-2 overflow-hidden"
                >
                  <button className="block w-full  text-left py-2 px-4 rounded hover:bg-gray-700">Executive dashboard</button>
                  <button className="block w-full text-left py-2 px-4 rounded hover:bg-gray-700">This week's progress</button>
                  <button className="block w-full text-left py-2 px-4 rounded hover:bg-gray-700">Shipped vs estimated</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center w-full py-2 px-4 rounded hover:bg-gray-700"
          >
            <Lightbulb className="mr-2" size={18} /> Insights
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center w-full py-2 px-4 rounded hover:bg-gray-700"
          >
            <GitBranch className="mr-2" size={18} /> Roadmap
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center w-full py-2 px-4 rounded hover:bg-gray-700"
          >
            <Target className="mr-2" size={18} /> Goals
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center w-full py-2 px-4 rounded hover:bg-gray-700"
          >
            <CheckSquare className="mr-2" size={18} /> Approvals
          </motion.button>
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
            Financial Dashboard
          </motion.h2>
          
          {activeSubmenu === 'dataInput' ? (
            <Card>
              <CardHeader>
                <CardTitle>Financial Data Input</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-200px)] pr-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">General Financial Data</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="income">Income</Label>
                          <Input
                            id="income"
                            type="number"
                            name="income"
                            value={financialData.income || ''}
                            onChange={(e) => handleInputChange(e, 'income')}
                          />
                        </div>
                        <div>
                          <Label htmlFor="expenses">Expenses</Label>
                          <Input
                            id="expenses"
                            type="number"
                            name="expenses"
                            value={financialData.expenses || ''}
                            onChange={(e) => handleInputChange(e, 'expenses')}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cashInflows">Cash Inflows</Label>
                          <Input
                            id="cashInflows"
                            type="number"
                            name="cashInflows"
                            value={financialData.cashInflows || ''}
                            onChange={(e) => handleInputChange(e, 'cashInflows')}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cashToHand">Cash To Hand</Label>
                          <Input
                            id="cashToHand"
                            type="number"
                            name="cashToHand"
                            value={financialData.cashToHand || ''}
                            onChange={(e) => handleInputChange(e, 'cashToHand')}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Monthly Income</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                          <div key={month}>
                            <Label htmlFor={`month-${index}`}>{month}</Label>
                            <Input
                              id={`month-${index}`}
                              type="number"
                              value={financialData.monthlyIncome[index] || ''}
                              onChange={(e) => handleInputChange(e, 'monthlyIncome', index)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Quarterly Income</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {['Q1', 'Q2'].map((quarter, index) => (
                          <div key={quarter}>
                            <Label htmlFor={`quarter-${index}`}>{quarter}</Label>
                            <Input
                              id={`quarter-${index}`}
                              type="number"
                              value={financialData.quarterlyIncome[index] || ''}
                              onChange={(e) => handleInputChange(e, 'quarterlyIncome', index)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Payroll</h4>
                      {financialData.payroll.map((item, index) => (
                        <div key={index} className="grid grid-cols-3 gap-4 mb-2">
                          <div>
                            <Label htmlFor={`payroll-dept-${index}`}>Department</Label>
                            <Input
                              id={`payroll-dept-${index}`}
                              type="text"
                              value={item.department}
                              onChange={(e) => handleInputChange(e, 'payroll', index, 'department')}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`payroll-amount-${index}`}>Amount</Label>
                            <Input
                              id={`payroll-amount-${index}`}
                              type="number"
                              value={item.amount || ''}
                              onChange={(e) => handleInputChange(e, 'payroll', index, 'amount')}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`payroll-date-${index}`}>Pay Date</Label>
                            <Input
                              id={`payroll-date-${index}`}
                              type="date"
                              value={item.payDate}
                              onChange={(e) => handleInputChange(e, 'payroll', index, 'payDate')}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Client Invoices</h4>
                      {financialData.clients.map((client, index) => (
                        <div key={index} className="grid grid-cols-3 gap-4 mb-2">
                          <div>
                            <Label htmlFor={`client-name-${index}`}>Client Name</Label>
                            <Input
                              id={`client-name-${index}`}
                              type="text"
                              value={client.name}
                              onChange={(e) => handleInputChange(e, 'clients', index, 'name')}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`client-amount-${index}`}>Amount</Label>
                            <Input
                              id={`client-amount-${index}`}
                              type="number"
                              value={client.amount || ''}
                              onChange={(e) => handleInputChange(e, 'clients', index, 'amount')}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`client-date-${index}`}>Due Date</Label>
                            <Input
                              id={`client-date-${index}`}
                              type="date"
                              value={client.dueDate}
                              onChange={(e) => handleInputChange(e, 'clients', index, 'dueDate')}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button onClick={calculateFinances}>Update Dashboard</Button>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
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
                      <TableRow key={index}>
                        <TableCell>{item.department} Payroll</TableCell>
                        <TableCell>${item.amount.toLocaleString()}</TableCell>
                        <TableCell>{item.payDate}</TableCell>
                      </TableRow>
                    ))}
                    {financialData.clients.map((client, index) => (
                      <TableRow key={index}>
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