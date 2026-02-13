import { useForm } from "@refinedev/react-hook-form";
import { subjectSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useList } from "@refinedev/core";
import { Department } from "@/types";

const SubjectsCreate = () => {
  const form = useForm({
    resolver: zodResolver(subjectSchema),
    refineCoreProps: {
      resource: "subjects",
      action: "create",
    },
  });

  const { query: departmentsQuery } = useList<Department>({
    resource: "departments",
    pagination: { pageSize: 100 },
  });

  const departments = departmentsQuery.data?.data || [];

  const {
    refineCore: { onFinish },
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onFinish)} className="space-y-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Subject Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Subject Code" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <FormControl>
                <select {...field}>
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Subject"}
        </Button>
      </form>
    </Form>
  );
};

export default SubjectsCreate;
