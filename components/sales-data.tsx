'use client'

import React, { useEffect, useState, ReactNode } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, Menu, X, Home, Zap, ChartBar, DollarSign, FileText } from 'lucide-react'

interface FormData {
  email: string
  chatterName: string
  timezone: string
  date: string
  modelsWorkedOn: string
  shiftTime: string
  wasItCover: boolean
  whoCovered: string
  totalNetSale: string
  pay?: number
}

interface ChatterGroup {
  chatterName: string
  totalPay: number
  entries: FormData[]
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

const menuItems = [
  { name: 'Home', icon: Home, hasDropdown: false },
  { name: 'Sales Data', icon: ChartBar, hasDropdown: true, submenu: [
    { name: 'Form', url: '/form' },
    { name: 'Pay Period', url: '/pay-periods' },
  ]},
  { name: 'Sales', icon: DollarSign, hasDropdown: false, url: '/sales' },
  { name: 'Invoice Creator', icon: FileText, hasDropdown: false, url: '/invoice' },
]

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
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

export default function SalesDashboard() {
  const [chatterGroups, setChatterGroups] = useState<ChatterGroup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedChatter, setExpandedChatter] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768)
    }

    handleResize() // Set initial state
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const data: FormData[] = JSON.parse(localStorage.getItem('chatterData') || '[]')
    const groupedData: ChatterGroup[] = data.reduce((acc: ChatterGroup[], item: FormData) => {
      const pay = parseFloat(item.totalNetSale) * 0.07
      const itemWithPay = { ...item, pay }

      let group = acc.find(g => g.chatterName === item.chatterName)
      if (!group) {
        group = { chatterName: item.chatterName, totalPay: 0, entries: [] }
        acc.push(group)
      }

      group.totalPay += pay
      group.entries.push(itemWithPay)

      return acc
    }, [])

    setChatterGroups(groupedData)
    setIsLoading(false)
  }, [])

  const toggleChatter = (chatterName: string) => {
    setExpandedChatter(expandedChatter === chatterName ? null : chatterName)
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
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chatter Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Pay
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {chatterGroups.map((group) => (
                      <React.Fragment key={group.chatterName}>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {group.chatterName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${group.totalPay.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Button
                              variant="ghost"
                              onClick={() => toggleChatter(group.chatterName)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {expandedChatter === group.chatterName ? (
                                <ChevronDown className="h-5 w-5 inline mr-1" />
                              ) : (
                                <ChevronRight className="h-5 w-5 inline mr-1" />
                              )}
                              {expandedChatter === group.chatterName ? 'Hide' : 'Show'} Details
                            </Button>
                          </td>
                        </tr>
                        {expandedChatter === group.chatterName && (
                          <tr>
                            <td colSpan={3} className="px-6 py-4">
                              <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timezone</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Models Worked On</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift Time</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Was It Cover?</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Who Covered</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Net Sale</th>
                                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay (7%)</th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white divide-y divide-gray-200">
                                    {group.entries.map((entry, index) => (
                                      <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.timezone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.modelsWorkedOn}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.shiftTime}</td>
                                        <td className="px-6 py-4  whitespace-nowrap text-sm text-gray-500">{entry.wasItCover ? 'Yes' : 'No'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.whoCovered}</td>
                                        <td className="px-6 py-4 whitespace-nowrap  text-sm text-gray-500">${entry.totalNetSale}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${entry.pay?.toFixed(2)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </div>
        </main>
      </div>
    </div>
  )
}