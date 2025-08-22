"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IconPlus, IconUser } from "@tabler/icons-react"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { User, ROLES } from "./types"

// User form schema for validation
const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  bdmTag: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type UserFormValues = z.infer<typeof userFormSchema>

interface UserFormProps {
  onUserCreated: (user: User) => void
}

export function UserForm({ onUserCreated }: UserFormProps) {
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  
  // Setup form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      bdmTag: "",
      password: "",
      confirmPassword: "",
    },
  })
  
  // Handle form submission
  const onSubmit = (data: UserFormValues) => {
    setIsCreatingUser(true)
    
    // Simulate API call to create user
    setTimeout(() => {
      const newUser: User = {
        id: Date.now(), // Use timestamp as temporary ID
        name: data.name,
        email: data.email,
        role: data.role,
        status: "active",
        lastLogin: null,
        createdAt: new Date(),
      }
      
      onUserCreated(newUser)
      setIsCreatingUser(false)
      form.reset()
      
      toast.success(`User ${data.name} created successfully`)
    }, 1500)
  }

  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-xl font-semibold">Create New User</CardTitle>
        <CardDescription>Add a new user to the system</CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ROLES.map(role => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    This determines what permissions and access the user will have
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {form.watch("role") === "Business Development Manager" && (
              <FormField
                control={form.control}
                name="bdmTag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>BDM Tag</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter BDM tag" {...field} />
                    </FormControl>
                    <FormDescription>
                      Unique identifier for this Business Development Manager
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Must be at least 8 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Re-enter your password to confirm
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit"
                className="min-w-[150px]"
                disabled={isCreatingUser}
              >
                {isCreatingUser ? (
                  <>
                    <IconUser className="mr-2 h-4 w-4 animate-pulse" />
                    Creating...
                  </>
                ) : (
                  <>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Create User
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 