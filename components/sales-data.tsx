'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, Menu, X, Home, Zap, ChartBar, DollarSign, FileText, Edit2, Save } from 'lucide-react'
import { supabase } from '@/app/utils/supabase'

// Database schema interface (snake_case)
interface FormData {
  id?: number
  email: string
  chatter_name: string
  timezone: string
  date: string
  models_worked_on: string
  shift_time: string
  was_it_cover: string
  who_covered: string
  total_net_sale: string
  pay?: number
  pay_percentage: number
}

// UI representation interface (camelCase)
interface ChatterEntry {
  id?: number
  email: string
  chatterName: string
  timezone: string
  date: string
  modelsWorkedOn: string
  shiftTime: string
  wasItCover: string
  whoCovered: string
  totalNetSale: string
  pay: number
  payPercentage: number
}

interface ChatterGroup {
  chatterName: string
  totalPay: number
  entries: ChatterEntry[]
  payPercentage: number
}

interface PayPeriod {
  start: string
  end: string
  invoiceDate: string
  chatterPayDate: string
}

interface PayPeriodGroup {
  payPeriod: PayPeriod
  chatterGroups: ChatterGroup[]
  totalPay: number
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background"
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border border-input hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground"
    }
    const sizes = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md",
      lg: "h-11 px-8 rounded-md",
      icon: "h-10 w-10"
    }
    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`relative overflow-hidden ${className}`} {...props}>
        <div className="h-full w-full overflow-auto">{children}</div>
      </div>
    )
  }
)
ScrollArea.displayName = "ScrollArea"

interface MenuItem {
  name: string
  icon: React.ElementType
  hasDropdown?: boolean
  url?: string
  submenu?: { name: string; url: string }[]
}

const menuItems: MenuItem[] = [
  { name: 'Home', icon: Home, hasDropdown: false },
  { name: 'Sales Data', icon: ChartBar, hasDropdown: true, submenu: [
    { name: 'Form', url: '/form' },
    { name: 'Pay Period', url: '/pay-periods' },
  ]},
  { name: 'Sales', icon: DollarSign, hasDropdown: false, url: '/sales' },
  { name: 'Invoice Creator', icon: FileText, hasDropdown: false, url: '/invoice' },
]

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    )
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white p-4 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
      >
        <h1 className="text-2xl font-bold mb-8">Connect Chatting LLC</h1>
        <nav>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <div className="flex items-center justify-between p-2 hover:bg-gray-800 rounded-md cursor-pointer">
                  <Link href={item.url || '#'} className="flex items-center space-x-3 flex-grow">
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                  {item.hasDropdown && (
                    <button
                      onClick={() => toggleExpand(item.name)}
                      aria-label={`Expand ${item.name}`}
                      className="p-1 hover:bg-gray-700 rounded-full"
                    >
                      <motion.div
                        animate={{ rotate: expandedItems.includes(item.name) ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown size={16} />
                      </motion.div>
                    </button>
                  )}
                </div>
                {item.hasDropdown && item.submenu && (
                  <AnimatePresence>
                    {expandedItems.includes(item.name) && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="ml-6 mt-2 space-y-2"
                      >
                        {item.submenu.map((subItem) => (
                          <li key={subItem.name}>
                            <Link href={subItem.url} className="block p-2 hover:bg-gray-800 rounded-md">
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-4 left-4">
          <button className="p-2 bg-gray-800 rounded-full" aria-label="Quick action">
            <Zap size={20} />
          </button>
        </div>
      </motion.aside>
    </>
  )
}

const payPeriods: PayPeriod[] = [
  { start: 'November 1, 2024', end: 'November 13, 2024', invoiceDate: 'November 14, 2024', chatterPayDate: 'November 15, 2024' },
  { start: 'November 14, 2024', end: 'November 28, 2024', invoiceDate: 'November 29, 2024', chatterPayDate: 'November 30, 2024' },
  { start: 'November 29, 2024', end: 'December 13, 2024', invoiceDate: 'December 14, 2024', chatterPayDate: 'December 15, 2024' },
  { start: 'December 14, 2024', end: 'December 28, 2024', invoiceDate: 'December 29, 2024', chatterPayDate: 'December 30, 2024' },
  { start: 'December 29, 2024', end: 'January 13, 2025', invoiceDate: 'January 14, 2025', chatterPayDate: 'January 15, 2025' },
  { start: 'January 14, 2025', end: 'January 28, 2025', invoiceDate: 'January 29, 2025', chatterPayDate: 'January 30, 2025' },
]

export default function SalesDashboard() {
  const [payPeriodGroups, setPayPeriodGroups] = useState<PayPeriodGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedPayPeriod, setExpandedPayPeriod] = useState<string | null>(null)
  const [expandedChatter, setExpandedChatter] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [editingChatter, setEditingChatter] = useState<string | null>(null)
  const [editedPercentage, setEditedPercentage] = useState<number>(0)

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('sales')
          .select('*')
          .order('date', { ascending: true })

        if (error) throw error

        // Fix for line 259: Add null check and provide default empty array
        const typedData: FormData[] = Array.isArray(data) ? data : [];

        const groupedData: PayPeriodGroup[] = payPeriods.map(payPeriod => {
          const periodEntries = typedData.filter(entry => {
            const entryDate = new Date(entry.date)
            return entryDate >= new Date(payPeriod.start) && entryDate <= new Date(payPeriod.end)
          })

          const chatterGroups: ChatterGroup[] = periodEntries.reduce((acc: ChatterGroup[], item: FormData) => {
            const payPercentage = item.pay_percentage || 7
            const pay = parseFloat(item.total_net_sale) * (payPercentage / 100)
            
            // Transform database fields to UI fields
            const transformedEntry: ChatterEntry = {
              id: item.id,
              email: item.email,
              chatterName: item.chatter_name,
              timezone: item.timezone,
              date: item.date,
              modelsWorkedOn: item.models_worked_on,
              shiftTime: item.shift_time,
              wasItCover: item.was_it_cover,
              whoCovered: item.who_covered,
              totalNetSale: item.total_net_sale,
              pay,
              payPercentage
            }

            let group = acc.find(g => g.chatterName === item.chatter_name)
            if (!group) {
              group = { chatterName: item.chatter_name, totalPay: 0, entries: [], payPercentage }
              acc.push(group)
            }

            group.totalPay += pay
            group.entries.push(transformedEntry)

            return acc
          }, [])

          const totalPay = chatterGroups.reduce((sum, group) => sum + group.totalPay, 0)

          return { payPeriod, chatterGroups, totalPay }
        })

        setPayPeriodGroups(groupedData)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const togglePayPeriod = (payPeriodStart: string) => {
    setExpandedPayPeriod(expandedPayPeriod === payPeriodStart ? null : payPeriodStart)
  }

  const toggleChatter = (payPeriodStart: string, chatterName: string) => {
    const key = `${payPeriodStart}-${chatterName}`
    setExpandedChatter(expandedChatter === key ? null : key)
  }

  const startEditing = (payPeriodStart: string, chatterName: string, currentPercentage: number) => {
    setEditingChatter(`${payPeriodStart}-${chatterName}`)
    setEditedPercentage(currentPercentage)
  }

  const saveEditedPercentage = async (payPeriodStart: string, chatterName: string) => {
    try {
      const { data: entries, error: fetchError } = await supabase
        .from('sales')
        .select('*')
        .eq('chatter_name', chatterName)
        .gte('date', payPeriodStart)

      if (fetchError) throw fetchError

      // Fix for line 344: Add null check and provide default empty array
      const validEntries: FormData[] = Array.isArray(entries) ? entries : [];

      // Update all matching entries
      for (const entry of validEntries) {
        const { error: updateError } = await supabase
          .from('sales')
          .update({ pay_percentage: editedPercentage })
          .eq('id', entry.id)

        if (updateError) throw updateError
      }

      // Refetch data to update UI
      const { data: updatedData, error } = await supabase
        .from('sales')
        .select('*')
        .order('date', { ascending: true })

      if (error) throw error

      // Fix for line 358: Add null check and provide default empty array
      const typedUpdatedData: FormData[] = Array.isArray(updatedData) ? updatedData : [];

      const groupedData = payPeriods.map(payPeriod => {
        const periodEntries = typedUpdatedData.filter(entry => {
          const entryDate = new Date(entry.date)
          return entryDate >= new Date(payPeriod.start) && entryDate <= new Date(payPeriod.end)
        })

        const chatterGroups = periodEntries.reduce((acc: ChatterGroup[], item: FormData) => {
          const payPercentage = item.pay_percentage || 7
          const pay = parseFloat(item.total_net_sale) * (payPercentage / 100)
          
          const transformedEntry: ChatterEntry = {
            id: item.id,
            email: item.email,
            chatterName:  item.chatter_name,
            timezone: item.timezone,
            date:  item.date,
            modelsWorkedOn: item.models_worked_on,
            shiftTime: item.shift_time,
            wasItCover: item.was_it_cover,
            whoCovered: item.who_covered,
            totalNetSale: item.total_net_sale,
            pay,
            payPercentage
          }

          let group = acc.find(g => g.chatterName === item.chatter_name)
          if (!group) {
            group = { chatterName: item.chatter_name, totalPay: 0, entries: [], payPercentage }
            acc.push(group)
          }

          group.totalPay += pay
          group.entries.push(transformedEntry)

          return acc
        }, [])

        const totalPay = chatterGroups.reduce((sum, group) => sum + group.totalPay, 0)

        return { payPeriod, chatterGroups, totalPay }
      })

      setPayPeriodGroups(groupedData)
      setEditingChatter(null)
    } catch (error) {
      console.error('Error updating percentage:', error)
    }
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Sales Data</h1>
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
              {payPeriodGroups.map((group) => (
                <div key={group.payPeriod.start} className="mb-8 bg-white shadow overflow-hidden sm:rounded-lg">
                  <div
                    className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer"
                    onClick={() => togglePayPeriod(group.payPeriod.start)}
                  >
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Pay Period: {group.payPeriod.start} to {group.payPeriod.end}
                    </h3>
                    <div className="flex items-center">
                      <span className="mr-2 text-sm text-gray-500">
                        Total Pay: ${group.totalPay.toFixed(2)}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-500 transform transition-transform ${
                          expandedPayPeriod === group.payPeriod.start ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                  {expandedPayPeriod === group.payPeriod.start && (
                    <div className="border-t border-gray-200">
                      {group.chatterGroups.map((chatterGroup) => (
                        <div key={chatterGroup.chatterName} className="border-b border-gray-200 last:border-b-0">
                          <div
                            className="px-4 py-4 sm:px-6 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                            onClick={() => toggleChatter(group.payPeriod.start, chatterGroup.chatterName)}
                          >
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              {chatterGroup.chatterName}
                            </p>
                            <div className="flex items-center">
                              <span className="mr-2 text-sm text-gray-500">
                                Total Pay: ${chatterGroup.totalPay.toFixed(2)} ({chatterGroup.payPercentage}%)
                              </span>
                              {editingChatter === `${group.payPeriod.start}-${chatterGroup.chatterName}` ? (
                                <>
                                  <input
                                    type="number"
                                    value={editedPercentage}
                                    onChange={(e) => setEditedPercentage(Number(e.target.value))}
                                    className="w-16 px-2 py-1 text-sm border rounded mr-2"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      saveEditedPercentage(group.payPeriod.start, chatterGroup.chatterName)
                                    }}
                                  >
                                    <Save className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    startEditing(group.payPeriod.start, chatterGroup.chatterName, chatterGroup.payPercentage)
                                  }}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                              )}
                              <ChevronDown
                                className={`h-5 w-5 text-gray-500 transform transition-transform ${
                                  expandedChatter === `${group.payPeriod.start}-${chatterGroup.chatterName}` ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                          </div>
                          
                          {expandedChatter === `${group.payPeriod.start}-${chatterGroup.chatterName}` && (
                            <div className="px-4 py-4 sm:px-6 bg-gray-50">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Models Worked On</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift Time</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Was It Cover</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Who Covered</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Net Sale</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay ({chatterGroup.payPercentage}%)</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {chatterGroup.entries.map((entry, index) => (
                                    <tr key={index}>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.date}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.modelsWorkedOn}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.shiftTime}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.wasItCover}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.whoCovered}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${entry.totalNetSale}</td>
                                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${entry.pay.toFixed(2)}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
        </main>
      </div>
    </div>
  )
}