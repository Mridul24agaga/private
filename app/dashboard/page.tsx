"use client"

import React, { useState } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { ArrowLeft, Bell, CalendarClock, ChevronDown, DollarSign, FileText, Home, Package2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { cn } from "@/libs/utils"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

// Component definitions
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

// Tabs components
const Tabs = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = "TabsContent"

export default function FinancialDashboard() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<'dashboard' | 'dataInput'>('dashboard')
  const [activeTab, setActiveTab] = useState('general')
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
      let newData = { ...prevData }
      if (category === 'monthlyIncome') {
        newData.monthlyIncome[index!] = parseFloat(value) || 0
      } else if (category === 'quarterlyIncome') {
        newData.quarterlyIncome[index!] = parseFloat(value) || 0
      } else if (category === 'clients' || category === 'payroll') {
        newData[category][index!] = { ...newData[category][index!], [subCategory!]: value }
      } else {
        newData[name as keyof typeof newData] = parseFloat(value) || 0
      }
      
      // Automatically calculate derived values
      newData.netProfit = newData.income - newData.expenses
      newData.grossProfitMargin = newData.income !== 0 ? (newData.netProfit / newData.income) * 100 : 0
      
      return newData
    })
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
  }

  const toggleView = (view: 'dashboard' | 'dataInput') => {
    setActiveView(view)
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
            <Card>
              <CardHeader>
                <CardTitle>Financial Data Input</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger
                      value="general"
                      onClick={() => setActiveTab('general')}
                      data-state={activeTab === 'general' ? 'active' : ''}
                    >
                      General
                    </TabsTrigger>
                    <TabsTrigger
                      value="income"
                      onClick={() => setActiveTab('income')}
                      data-state={activeTab === 'income' ? 'active' : ''}
                    >
                      Income
                    </TabsTrigger>
                    <TabsTrigger
                      value="payroll"
                      onClick={() => setActiveTab('payroll')}
                      data-state={activeTab === 'payroll' ? 'active' : ''}
                    >
                      Payroll
                    </TabsTrigger>
                    <TabsTrigger
                      value="clients"
                      onClick={() => setActiveTab('clients')}
                      data-state={activeTab === 'clients' ? 'active' : ''}
                    >
                      Clients
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="general" hidden={activeTab !== 'general'}>
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
                  </TabsContent>
                  <TabsContent value="income" hidden={activeTab !== 'income'}>
                    <div className="space-y-4">
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
                    </div>
                  </TabsContent>
                  <TabsContent value="payroll" hidden={activeTab !== 'payroll'}>
                    <div className="space-y-4">
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
                  </TabsContent>
                  <TabsContent value="clients" hidden={activeTab !== 'clients'}>
                    <div className="space-y-4">
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
                  </TabsContent>
                </Tabs>
                <div className="mt-6">
                  <Button onClick={() => toggleView('dashboard')}>View Dashboard</Button>
                </div>
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