"use client"

import React, { useReducer, useState, ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import * as TabsPrimitive from "@radix-ui/react-tabs"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/libs/utils"

// Card Components
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

// Button Component
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  }
>(({ className, variant = "default", ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
          "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "destructive",
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
          "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
          "text-primary underline-offset-4 hover:underline": variant === "link",
        },
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

// Input Component
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

// Label Component
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

// Select Components
const Select = SelectPrimitive.Root

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80",
        position === "popper" && "translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectValue = SelectPrimitive.Value

// Dialog Components
const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

// Tabs Components
const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

// FinancialDashboard Component
interface Client {
  name: string
  amount: number
  dueDate: string
  percentage: number
  totalPaid: number
  status: string
  startDate: string
}

interface Chatter {
  name: string
  payment: number
  paymentDate: string
}

interface FinancialData {
  income: number
  expenses: number
  netProfit: number
  grossProfitMargin: number
  monthlyIncome: number[]
  quarterlyIncome: number[]
  cashInflows: number
  cashToHand: number
  clients: Client[]
  chatters: Chatter[]
  payroll: Array<{ department: string; amount: number; payDate: string }>
}

type Action =
  | { type: 'UPDATE_FIELD'; field: keyof FinancialData; value: any }
  | { type: 'UPDATE_CLIENT'; index: number; client: Client }
  | { type: 'ADD_CLIENT'; client: Client }
  | { type: 'REMOVE_CLIENT'; index: number }
  | { type: 'UPDATE_CHATTER'; index: number; chatter: Chatter }
  | { type: 'ADD_CHATTER'; chatter: Chatter }
  | { type: 'REMOVE_CHATTER'; index: number }

function financialReducer(state: FinancialData,   action: Action): FinancialData {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value }
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map((client, index) =>
          index === action.index ? action.client : client
        ),
      }
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.client] }
    case 'REMOVE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter((_, index) => index !== action.index),
      }
    case 'UPDATE_CHATTER':
      return {
        ...state,
        chatters: state.chatters.map((chatter, index) =>
          index === action.index ? action.chatter : chatter
        ),
      }
    case 'ADD_CHATTER':
      return { ...state, chatters: [...state.chatters, action.chatter] }
    case 'REMOVE_CHATTER':
      return {
        ...state,
        chatters: state.chatters.filter((_, index) => index !== action.index),
      }
    default:
      return state
  }
}

const initialState: FinancialData = {
  income: 0,
  expenses: 0,
  netProfit: 0,
  grossProfitMargin: 0,
  monthlyIncome: [0, 0, 0, 0, 0, 0],
  quarterlyIncome: [0, 0],
  cashInflows: 0,
  cashToHand: 0,
  clients: [],
  chatters: [],
  payroll: []
}

export default function FinancialDashboard() {
  const [state, dispatch] = useReducer(financialReducer, initialState)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [showClientDialog, setShowClientDialog] = useState(false)
  const [showChatterDialog, setShowChatterDialog] = useState(false)
  const [selectedClient, setSelectedClient] = useState<number | null>(null)
  const [selectedChatter, setSelectedChatter] = useState<number | null>(null)
  const [tempClientData, setTempClientData] = useState<Client>({
    name: '',
    amount: 0,
    dueDate: '',
    percentage: 0,
    totalPaid: 0,
    status: 'Active',
    startDate: ''
  })
  const [tempChatterData, setTempChatterData] = useState<Chatter>({
    name: '',
    payment: 0,
    paymentDate: ''
  })

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    category: string,
    index?: number,
    subCategory?: string
  ) => {
    const { name, value } = e.target

    if (category === 'monthlyIncome') {
      const newMonthlyIncome = [...state.monthlyIncome]
      newMonthlyIncome[index!] = parseFloat(value) || 0
      dispatch({ type: 'UPDATE_FIELD', field: 'monthlyIncome', value: newMonthlyIncome })
    } else if (category === 'quarterlyIncome') {
      const newQuarterlyIncome = [...state.quarterlyIncome]
      newQuarterlyIncome[index!] = parseFloat(value) || 0
      dispatch({ type: 'UPDATE_FIELD', field: 'quarterlyIncome', value: newQuarterlyIncome })
    } else if (category === 'payroll') {
      const newPayroll = [...state.payroll]
      newPayroll[index!] = { ...newPayroll[index!], [subCategory!]: value }
      dispatch({ type: 'UPDATE_FIELD', field: 'payroll', value: newPayroll })
    } else if (name in state) {
      dispatch({ type: 'UPDATE_FIELD', field: name as keyof FinancialData, value: parseFloat(value) || 0 })
    }
  }

  const handleClientInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTempClientData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'percentage' || name === 'totalPaid' ? parseFloat(value) || 0 : value
    }))
  }

  const handleChatterInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTempChatterData(prev => ({
      ...prev,
      [name]: name === 'payment' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSaveClient = () => {
    if (selectedClient !== null) {
      dispatch({ type: 'UPDATE_CLIENT', index: selectedClient, client: tempClientData })
    } else {
      dispatch({ type: 'ADD_CLIENT', client: tempClientData })
    }
    setShowClientDialog(false)
    setSelectedClient(null)
    setTempClientData({
      name: '',
      amount: 0,
      dueDate: '',
      percentage: 0,
      totalPaid: 0,
      status: 'Active',
      startDate: ''
    })
  }

  const handleSaveChatter = () => {
    if (selectedChatter !== null) {
      dispatch({ type: 'UPDATE_CHATTER', index: selectedChatter, chatter: tempChatterData })
    } else {
      dispatch({ type: 'ADD_CHATTER', chatter: tempChatterData })
    }
    setShowChatterDialog(false)
    setSelectedChatter(null)
    setTempChatterData({
      name: '',
      payment: 0,
      paymentDate: ''
    })
  }

  const handleRemoveClient = (index: number) => {
    dispatch({ type: 'REMOVE_CLIENT', index })
  }

  const handleRemoveChatter = (index: number) => {
    dispatch({ type: 'REMOVE_CHATTER', index })
  }

  const handleSave = () => {
    console.log('Saving data:', { ...state })
    setShowSaveDialog(true)
  }

  const toggleView = () => {
    setShowDashboard(!showDashboard)
  }

  const renderDataInput = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6">Financial Data Input</h2>
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
          <TabsTrigger value="chatters">Chatters</TabsTrigger>
          <TabsTrigger value="cash-flow">Cash Flow</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="income">Total Income</Label>
              <Input
                id="income"
                type="number"
                value={state.income || ''}
                onChange={(e) => handleInputChange(e, 'income')}
              />
            </div>
            <div>
              <Label htmlFor="expenses">Total Expenses</Label>
              <Input
                id="expenses"
                type="number"
                value={state.expenses || ''}
                onChange={(e) => handleInputChange(e, 'expenses')}
              />
            </div>
            <div>
              <Label htmlFor="netProfit">Net Profit</Label>
              <Input
                id="netProfit"
                type="number"
                value={state.netProfit || ''}
                onChange={(e) => handleInputChange(e, 'netProfit')}
              />
            </div>
            <div>
              <Label htmlFor="grossProfitMargin">Gross Profit Margin (%)</Label>
              <Input
                id="grossProfitMargin"
                type="number"
                value={state.grossProfitMargin || ''}
                onChange={(e) => handleInputChange(e, 'grossProfitMargin')}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="income">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold mb-2">Monthly Income</h4>
              <div className="grid grid-cols-3 gap-4">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                  <div key={month}>
                    <Label htmlFor={`month-${index}`}>{month}</Label>
                    <Input
                      id={`month-${index}`}
                      type="number"
                      value={state.monthlyIncome[index] || ''}
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
                      value={state.quarterlyIncome[index] || ''}
                      onChange={(e) => handleInputChange(e, 'quarterlyIncome', index)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="expenses">
          <div className="space-y-4">
            <div>
              <Label htmlFor="totalExpenses">Total Expenses</Label>
              <Input
                id="totalExpenses"
                type="number"
                name="expenses"
                value={state.expenses || ''}
                onChange={(e) => handleInputChange(e, 'expenses')}
              />
            </div>
            <div>
              <h4 className="font-semibold mb-2">Payroll</h4>
              {state.payroll.map((item, index) => (
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
              <Button onClick={() => dispatch({ type: 'UPDATE_FIELD', field: 'payroll', value: [...state.payroll, { department: '', amount: 0, payDate: '' }] })}>
                Add Payroll Entry
              </Button>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="clients">
          <div className="space-y-4">
            {state.clients.map((client, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold mb-2">{client.name || `Client ${index + 1}`}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Amount</Label>
                    <Input type="number" value={client.amount} readOnly className="bg-gray-200" />
                  </div>
                  <div>
                    <Label>Due Date</Label>
                    <Input type="date" value={client.dueDate} readOnly className="bg-gray-200" />
                  </div>
                  <div>
                    <Label>Percentage</Label>
                    <Input type="number" value={client.percentage} readOnly className="bg-gray-200" />
                  </div>
                  <div>
                    <Label>Total Paid</Label>
                    <Input type="number" value={client.totalPaid} readOnly className="bg-gray-200" />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Input type="text" value={client.status} readOnly className="bg-gray-200" />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input type="date" value={client.startDate} readOnly className="bg-gray-200" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    onClick={() => {
                      setSelectedClient(index)
                      setTempClientData(client)
                      setShowClientDialog(true)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleRemoveClient(index)}
                    variant="destructive"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button
              onClick={() => {
                setSelectedClient(null)
                setTempClientData({
                  name: '',
                  amount: 0,
                  dueDate: '',
                  percentage: 0,
                  totalPaid: 0,
                  status: 'Active',
                  startDate: ''
                })
                setShowClientDialog(true)
              }}
            >
              Add Client
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="chatters">
          <div className="space-y-4">
            {state.chatters.map((chatter, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-md">
                <h4 className="font-semibold mb-2">{chatter.name || `Chatter ${index + 1}`}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Payment</Label>
                    <Input type="number" value={chatter.payment} readOnly className="bg-gray-200" />
                  </div>
                  <div>
                    <Label>Payment Date</Label>
                    <Input type="date" value={chatter.paymentDate} readOnly className="bg-gray-200" />
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                  <Button
                    onClick={() => {
                      setSelectedChatter(index)
                      setTempChatterData(chatter)
                      setShowChatterDialog(true)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleRemoveChatter(index)}
                    variant="destructive"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button
              onClick={() => {
                setSelectedChatter(null)
                setTempChatterData({
                  name: '',
                  payment: 0,
                  paymentDate: ''
                })
                setShowChatterDialog(true)
              }}
            >
              Add Chatter
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="cash-flow">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cashInflows">Cash Inflows</Label>
              <Input
                id="cashInflows"
                type="number"
                name="cashInflows"
                value={state.cashInflows || ''}
                onChange={(e) => handleInputChange(e, 'cashInflows')}
              />
            </div>
            <div>
              <Label htmlFor="cashToHand">Cash To Hand</Label>
              <Input
                id="cashToHand"
                type="number"
                name="cashToHand"
                value={state.cashToHand || ''}
                onChange={(e) => handleInputChange(e, 'cashToHand')}
              />
            </div>
            <div className="col-span-2">
              <h4 className="font-semibold mb-2">Profit Insights</h4>
              <p className="text-sm text-gray-600">
                {state.cashInflows > state.expenses 
                  ? "Current cash flow is positive. Consider reinvesting in growth areas or improving efficiency to increase profitability further."
                  : "Cash flow is negative. Review expenses and consider ways to increase income or reduce costs."}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between mt-6">
        <Button onClick={handleSave}>Save Changes</Button>
        <Button onClick={toggleView}>View Dashboard</Button>
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changes Saved</DialogTitle>
          </DialogHeader>
          <p>Your changes have been saved successfully.</p>
          <DialogFooter>
            <Button onClick={() => setShowSaveDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showClientDialog} onOpenChange={setShowClientDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedClient !== null ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientName" className="text-right">
                Name
              </Label>
              <Input
                id="clientName"
                name="name"
                value={tempClientData.name}
                onChange={handleClientInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientAmount" className="text-right">
                Amount
              </Label>
              <Input
                id="clientAmount"
                name="amount"
                type="number"
                value={tempClientData.amount}
                onChange={handleClientInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientDueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="clientDueDate"
                name="dueDate"
                type="date"
                value={tempClientData.dueDate}
                onChange={handleClientInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientPercentage" className="text-right">
                Percentage
              </Label>
              <Input
                id="clientPercentage"
                name="percentage"
                type="number"
                value={tempClientData.percentage}
                onChange={handleClientInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientTotalPaid" className="text-right">
                Total Paid
              </Label>
              <Input
                id="clientTotalPaid"
                name="totalPaid"
                type="number"
                value={tempClientData.totalPaid}
                onChange={handleClientInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientStatus" className="text-right">
                Status
              </Label>
              <Select
                name="status"
                value={tempClientData.status}
                onValueChange={(value) => setTempClientData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientStartDate" className="text-right">
                Start Date
              </Label>
              <Input
                id="clientStartDate"
                name="startDate"
                type="date"
                value={tempClientData.startDate}
                onChange={handleClientInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowClientDialog(false)} variant="outline">Cancel</Button>
            <Button onClick={handleSaveClient}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showChatterDialog} onOpenChange={setShowChatterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedChatter !== null ? 'Edit Chatter' : 'Add New Chatter'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="chatterName" className="text-right">
                Name
              </Label>
              <Input
                id="chatterName"
                name="name"
                value={tempChatterData.name}
                onChange={handleChatterInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="chatterPayment" className="text-right">
                Payment
              </Label>
              <Input
                id="chatterPayment"
                name="payment"
                type="number"
                value={tempChatterData.payment}
                onChange={handleChatterInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="chatterPaymentDate" className="text-right">
                Payment Date
              </Label>
              <Input
                id="chatterPaymentDate"
                name="paymentDate"
                type="date"
                value={tempChatterData.paymentDate}
                onChange={handleChatterInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowChatterDialog(false)} variant="outline">Cancel</Button>
            <Button onClick={handleSaveChatter}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )

  const renderDashboard = () => (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Financial Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${state.income.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${state.expenses.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${state.netProfit.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Gross Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{state.grossProfitMargin.toFixed(2)}%</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Top Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {state.clients
                .sort((a, b) => b.totalPaid - a.totalPaid)
                .slice(0, 5)
                .map((client, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{client.name}</span>
                    <span className="font-semibold">${client.totalPaid.toFixed(2)}</span>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Expenses (Chatters)</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {state.chatters
                .sort((a, b) => b.payment - a.payment)
                .slice(0, 5)
                .map((chatter, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{chatter.name}</span>
                    <span className="font-semibold">${chatter.payment.toFixed(2)}</span>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <Button onClick={toggleView}>Back to Input</Button>
    </div>
  )

  return (
    <div className="container mx-auto p-4">
      {showDashboard ? renderDashboard() : renderDataInput()}
    </div>
  )
}