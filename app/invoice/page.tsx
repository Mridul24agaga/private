'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import 'jspdf-autotable'
import jsPDF from 'jspdf'
import { UserOptions } from 'jspdf-autotable'
import { ChevronDown, ChevronRight, Menu, X, Home, Rocket, Lightbulb, Map, Target, ClipboardCheck, Zap, Upload, ChartBar, DollarSign, FileText } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => jsPDF;
  }
}

// Add this function
function getStableId(index: number): string {
  return `item-${index + 1}`;
}

interface InvoiceItem {
  id: string
  description: string
  netSales: number
  fees: number
  amount: number
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
        className={`${poppins.className} fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 text-white p-4 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
      >
        <h1 className="text-2xl font-bold mb-8 font-sans">Connect Chatting LLC</h1>
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

export default function InvoiceCreator() {
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [billTo, setBillTo] = useState('')
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: getStableId(0), description: '', netSales: 0, fees: 0, amount: 0 }
  ])
  const [notes, setNotes] = useState('Thanks for your business! We would appreciate timely payment of the total amount reflected in here. Please feel free to contact us for any questions or concerns.')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [logo] = useState<string>('https://media.discordapp.net/attachments/1217830384545562655/1296759070778200094/1.png?ex=671caeff&is=671b5d7f&hm=bf2144f269890224628a76e3ce829a6cab55abd878d5c572bef62671466736b1&=&format=webp&quality=lossless') // Updated logo state
  // Remove this line
  // const fileInputRef = useRef<HTMLInputElement>(null)
  const [templateData, setTemplateData] = useState('')

  const addItem = () => {
    setItems(prevItems => [
      ...prevItems,
      { id: getStableId(prevItems.length), description: '', netSales: 0, fees: 0, amount: 0 }
    ]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newItems = Array.from(items)
    const [reorderedItem] = newItems.splice(result.source.index, 1)
    newItems.splice(result.destination.index, 0, reorderedItem)

    setItems(newItems)
  }

  const calculateTotals = useCallback(() => {
    return items.reduce((acc, item) => ({
      netSalesTotal: acc.netSalesTotal + item.netSales,
      totalToPay: acc.totalToPay + item.amount
    }), { netSalesTotal: 0, totalToPay: 0 })
  }, [items])

  // Remove this function
  // const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (file) {
  //     const reader = new FileReader()
  //     reader.onload = (e) => {
  //       setLogo(e.target?.result as string)
  //     }
  //     reader.readAsDataURL(file)
  //   }
  // }

  const generatePDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const pageHeight = doc.internal.pageSize.height

    // Add header background
    doc.setFillColor(173, 216, 230) // Light blue color
    doc.rect(0, 0, pageWidth, 30, 'F')

    // Add invoice title and company name
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(18)
    doc.text('CLIENT INVOICE', 10, 15)
    doc.setFontSize(12)
    doc.text('CONNECT CHATTING LLC', 10, 25)

    // Add logo if available
    if (logo) {
      const logoWidth = 20
      const logoHeight = 20
      const logoX = pageWidth - logoWidth - 10
      const logoY = 5
      doc.addImage(logo, 'JPEG', logoX, logoY, logoWidth, logoHeight)
    }

    // Add invoice details
    doc.setFontSize(10)
    doc.text(`INVOICE #: ${invoiceNumber}`, pageWidth - 70, 40)
    doc.text(`INVOICE DATE START: ${dateStart}`, pageWidth - 70, 47)
    doc.text(`INVOICE DATE END: ${dateEnd}`, pageWidth - 70, 54)
    doc.text(`INVOICE DUE DATE: ${dueDate}`, pageWidth - 70, 61)

    // Add bill to section
    doc.rect(10, 35, 90, 30)
    doc.text('BILL TO:', 12, 42)
    const billToLines = doc.splitTextToSize(billTo, 80)
    doc.text(billToLines, 12, 49)

    // Add items table
    doc.autoTable({
      startY: 75,
      head: [['DESCRIPTION', 'NET SALES/TIPS', 'INFLOW/VV FEES', 'AMOUNT']],
      body: items.map(item => [
        item.description,
        item.netSales.toFixed(2),
        item.fees.toFixed(2),
        item.amount.toFixed(2)
      ]),
      foot: [
        ['', 'NET SALES TOTAL', '', calculateTotals().netSalesTotal.toFixed(2)],
        ['', 'TOTAL TO PAY', '', calculateTotals().totalToPay.toFixed(2)]
      ],
      styles: { fillColor: [173, 216, 230], lineColor: [0, 0, 0], lineWidth: 0.1 },
      headStyles: { fillColor: [173, 216, 230], textColor: [0, 0, 0] },
      footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] },
      theme: 'grid',
    })

    // Add notes
    const finalY = (doc as any).lastAutoTable.finalY || 200
    doc.setFillColor(173, 216, 230)
    doc.rect(0, finalY + 10, pageWidth, 30, 'F')
    doc.setTextColor(0, 0, 0)
    doc.text('NOTES:', 10, finalY + 20)
    const noteLines = doc.splitTextToSize(notes, pageWidth - 20)
    doc.text(noteLines, 10, finalY + 30)

    // Save the PDF
    doc.save('invoice.pdf')
  }

  const processTemplateData = (data: string) => {
    const lines = data.split('\n')
    const dataObj: { [key: string]: string } = {}

    lines.forEach(line => {
      const [key, value] = line.split(':').map(item => item.trim())
      if (key && value) {
        dataObj[key] = value
      }
    })

    setBillTo(dataObj['Bill To'] || '')
    setInvoiceNumber(dataObj['Invoice Number'] || '')
    
    // Parse and set dates
    const formatDate = (dateString: string) => {
      const [day, month, year] = dateString.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }

    setDateStart(formatDate(dataObj['Start Date'] || ''))
    setDateEnd(formatDate(dataObj['End Date'] || ''))
    setDueDate(formatDate(dataObj['Due Date'] || ''))

    const totalSales = parseFloat(dataObj['Total Sales'].replace(',', '')) || 0
    const netPay = parseFloat(dataObj['Net Pay'].replace(',', '')) || 0
    const netSalesTips = parseFloat(dataObj['Net Sales/Tips'].replace(',', '')) || totalSales
    const inflowVVFees = parseFloat(dataObj['Inflow/VV FEES'].replace(',', '')) || (totalSales - netPay)

    setItems([
      {
        id: getStableId(0),
        description: 'Invoice Item',
        netSales: netSalesTips,
        fees: inflowVVFees,
        amount: netPay
      }
    ]);
  }

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768)
    }

    handleResize() // Set initial state
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-64">
        <header className="z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <Button
              variant="outline"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-4 w-4" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
            <div className="bg-blue-200 p-4 mb-4 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">CLIENT INVOICE</h1>
                <h2 className="text-xl">CONNECT CHATTING LLC</h2>
              </div>
              <div className="flex items-center">
                {/* Remove this button and input */}
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center mr-4"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {logo ? 'Change Logo' : 'Upload Logo'}
                </Button> */}
                {logo && (
                  <img src={logo} alt="Company Logo" className="w-8 h-8 object-contain" />
                )}
                {/* Remove this input */}
                {/* <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                /> */}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="template-data" className="block font-bold mb-2">Paste Invoice Template Data:</label>
              <textarea
                id="template-data"
                value={templateData}
                onChange={(e) => {
                  setTemplateData(e.target.value)
                  processTemplateData(e.target.value)
                }}
                className="w-full h-40 p-2 border rounded"
                placeholder="Paste your invoice template data here..."
              />
              <Button 
                onClick={() => processTemplateData(templateData)} 
                className="mt-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Update Invoice with Pasted Data
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="border p-4">
                <label htmlFor="bill-to" className="block font-bold mb-2">BILL TO:</label>
                <textarea
                  id="bill-to"
                  value={billTo}
                  onChange={(e) => setBillTo(e.target.value)}
                  className="w-full h-24 p-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <div>
                  <label htmlFor="invoice-number" className="block">INVOICE #</label>
                  <input
                    id="invoice-number"
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label htmlFor="date-start" className="block">INVOICE DATE START</label>
                  <input
                    id="date-start"
                    type="date"
                    value={dateStart}
                    onChange={(e) => setDateStart(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label htmlFor="date-end" className="block">INVOICE DATE END</label>
                  <input
                    id="date-end"
                    type="date"
                    value={dateEnd}
                    onChange={(e) => setDateEnd(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label htmlFor="due-date" className="block">INVOICE DUE DATE</label>
                  <input
                    id="due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="items" isDropDisabled={false}>
                  {(provided) => (
                    <table className="w-full mb-4 border-collapse" {...provided.droppableProps} ref={provided.innerRef}>
                      <thead>
                        <tr className="bg-blue-200">
                          <th className="p-2 text-left border">DESCRIPTION</th>
                          <th className="p-2 text-right border">NET SALES/TIPS</th>
                          <th className="p-2 text-right border">INFLOW/VV FEES</th>
                          <th className="p-2 text-right border">AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="border-b"
                              >
                                <td className="p-2 border">
                                  <input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                    className="w-full p-1 border rounded"
                                    placeholder="Enter description"
                                  />
                                </td>
                                <td className="p-2 border">
                                  <input
                                    type="number"
                                    value={item.netSales}
                                    onChange={(e) => updateItem(item.id, 'netSales', parseFloat(e.target.value))}
                                    className="w-full p-1 border rounded text-right"
                                  />
                                </td>
                                <td className="p-2 border">
                                  <input
                                    type="number"
                                    value={item.fees}
                                    onChange={(e) => updateItem(item.id, 'fees', parseFloat(e.target.value))}
                                    className="w-full p-1 border rounded text-right"
                                  />
                                </td>
                                <td className="p-2 border">
                                  <input
                                    type="number"
                                    value={item.amount}
                                    onChange={(e) => updateItem(item.id, 'amount', parseFloat(e.target.value))}
                                    className="w-full p-1 border rounded text-right"
                                  />
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={2}></td>
                          <td className="p-2 text-right font-bold">NET SALES TOTAL:</td>
                          <td className="p-2 text-right border">${calculateTotals().netSalesTotal.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td colSpan={2}></td>
                          <td className="p-2 text-right font-bold">TOTAL TO PAY:</td>
                          <td className="p-2 text-right border">${calculateTotals().totalToPay.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td colSpan={4} className="text-right">
                            <button
                              onClick={addItem}
                              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                              aria-label="Add new item"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            {/* Remove this button */}
            {/* <button onClick={addItem} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Add Item
            </button> */}

            <div className="bg-blue-200 p-4 mb-4">
              <label htmlFor="notes" className="block font-bold mb-2">NOTES:</label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-24 p-2 border rounded"
              />
            </div>

            <button onClick={generatePDF} className="w-full md:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Save Invoice
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}