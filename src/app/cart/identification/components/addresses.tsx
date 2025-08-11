"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatternFormat } from "react-number-format";
import { useCreateShippingAddress } from "@/hooks/mutations/use-create-shipping-address";
import { useUpdateCartShippingAddress } from "@/hooks/mutations/use-update-cart-shipping-address";
import { toast } from "sonner";
import { useShippingAddresses } from "@/hooks/queries/use-shipping-addresses";

const formSchema = z.object({
  email: z.email("E-mail inválido"),
  fullName: z.string().trim().min(1, "Nome completo é obrigatório"),
  cpf: z
    .string()
    .trim()
    .min(1, "CPF é obrigatório")
    .refine((value) => value.replace(/\D/g, "").length === 11, "CPF inválido"),
  phone: z
    .string()
    .trim()
    .min(1, "Celular é obrigatório")
    .refine(
      (value) => value.replace(/\D/g, "").length === 11,
      "Celular inválido",
    ),
  zipCode: z
    .string()
    .trim()
    .min(1, "CEP é obrigatório")
    .refine((value) => value.replace(/\D/g, "").length === 8, "CEP inválido"),
  address: z.string().trim().min(1, "Endereço é obrigatório"),
  number: z.string().trim().min(1, "Número é obrigatório"),
  complement: z.string().optional().or(z.literal("")),
  district: z.string().trim().min(1, "Bairro é obrigatório"),
  city: z.string().trim().min(1, "Cidade é obrigatória"),
  state: z.string().trim().min(1, "Estado é obrigatório"),
});

type FormValues = z.infer<typeof formSchema>;

const Adresses = () => {
  const [selectedAdresses, setSelectedAdresses] = useState<string | null>(null);
  const createShippingAddressMutation = useCreateShippingAddress();
  const updateCartShippingAddressMutation = useUpdateCartShippingAddress();
  const { data: addresses } = useShippingAddresses();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      cpf: "",
      phone: "",
      zipCode: "",
      address: "",
      number: "",
      complement: "",
      district: "",
      city: "",
      state: "",
    },
  });

  async function onSubmit(values: FormValues) {
    const created = await createShippingAddressMutation.mutateAsync({
      recipientName: values.fullName,
      street: values.address,
      number: values.number,
      complement: values.complement || undefined,
      city: values.city,
      state: values.state,
      neighborhood: values.district,
      zipCode: values.zipCode.replace(/\D/g, ""),
      country: "BR",
      phone: values.phone.replace(/\D/g, ""),
      email: values.email,
      cpfOrCnpj: values.cpf.replace(/\D/g, ""),
    });
    await updateCartShippingAddressMutation.mutateAsync({
      shippingAddressId: created.id,
    });
    toast.success("Endereço cadastrado com sucesso!");
    form.reset({
      email: "",
      fullName: "",
      cpf: "",
      phone: "",
      zipCode: "",
      address: "",
      number: "",
      complement: "",
      district: "",
      city: "",
      state: "",
    });
    setSelectedAdresses(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedAdresses}
          onValueChange={setSelectedAdresses}
        >
          {addresses?.map((address) => (
            <Card key={address.id} className="mb-3">
              <CardContent>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value={address.id} id={address.id} />
                  <Label htmlFor={address.id} className="flex-1">
                    {address.recipientName}, {address.street}, {address.number}
                    {address.complement ? `, ${address.complement}` : ""},{" "}
                    {address.neighborhood}, {address.city} - {address.state},{" "}
                    {address.zipCode}
                  </Label>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card>
            <CardContent>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="add_new" id="add_new" />
                <Label htmlFor="add_new">Adicionar novo endereço</Label>
              </div>
            </CardContent>
          </Card>
        </RadioGroup>

        {selectedAdresses === "add_new" && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 grid grid-cols-6 gap-4"
            >
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Nome completo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <PatternFormat
                          format="###.###.###-##"
                          mask="_"
                          value={field.value}
                          onValueChange={(v) => field.onChange(v.value)}
                          onBlur={field.onBlur}
                          getInputRef={field.ref}
                          name={field.name}
                          customInput={Input}
                          placeholder="CPF"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Celular</FormLabel>
                      <FormControl>
                        <PatternFormat
                          format="(##) #####-####"
                          mask="_"
                          value={field.value}
                          onValueChange={(v) => field.onChange(v.value)}
                          onBlur={field.onBlur}
                          getInputRef={field.ref}
                          name={field.name}
                          customInput={Input}
                          placeholder="Celular"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <PatternFormat
                          format="#####-###"
                          mask="_"
                          value={field.value}
                          onValueChange={(v) => field.onChange(v.value)}
                          onBlur={field.onBlur}
                          getInputRef={field.ref}
                          name={field.name}
                          customInput={Input}
                          placeholder="CEP"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Endereço" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Número" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Complemento"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Estado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="col-span-6">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    createShippingAddressMutation.isPending ||
                    updateCartShippingAddressMutation.isPending
                  }
                >
                  {createShippingAddressMutation.isPending ||
                  updateCartShippingAddressMutation.isPending
                    ? "Salvando..."
                    : "Salvar endereço"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default Adresses;
