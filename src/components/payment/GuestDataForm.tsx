import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { User } from "lucide-react";

interface GuestData {
  totalGuests: number;
  firstName: string;
  lastName: string;
  cpf: string;
  email: string;
  phone?: string;
  birthday?: string;
  isMainGuest: string;
  checkIn: string;
  checkOut: string;
}

interface GuestDataFormProps {
  guestData: GuestData;
  onGuestDataChange: (data: GuestData) => void;
  maxCapacity?: number;
}

export function GuestDataForm({
  guestData,
  onGuestDataChange,
  maxCapacity = 6,
}: GuestDataFormProps) {
  const updateGuestData = (updates: Partial<GuestData>) => {
    onGuestDataChange({ ...guestData, ...updates });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Dados do Hóspede Titular
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Datas da Reserva */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="checkIn">Data de Check-in</Label>
            <Input
              id="checkIn"
              type="date"
              value={guestData.checkIn}
              onChange={(e) => updateGuestData({ checkIn: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="checkOut">Data de Check-out</Label>
            <Input
              id="checkOut"
              type="date"
              value={guestData.checkOut}
              onChange={(e) => updateGuestData({ checkOut: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Quantidade de Hóspedes */}
        <div>
          <Label htmlFor="totalGuests">Quantidade de Hóspedes</Label>
          <Select
            value={guestData.totalGuests.toString()}
            onValueChange={(value) =>
              updateGuestData({ totalGuests: parseInt(value) })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "hóspede" : "hóspedes"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de Reserva */}
        <div>
          <Label className="text-base mb-3 block">
            Você é o hóspede principal?
          </Label>
          <RadioGroup
            value={guestData.isMainGuest}
            onValueChange={(value) => updateGuestData({ isMainGuest: value })}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="main" id="main" />
              <Label htmlFor="main" className="cursor-pointer">
                Sim, eu sou o hóspede principal
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other" className="cursor-pointer">
                Não, estou reservando para outra pessoa
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Dados Pessoais */}
        <div className="space-y-4">
          <h4 className="font-semibold">
            {guestData.isMainGuest === "main"
              ? "Seus dados pessoais"
              : "Dados do hóspede titular"}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Nome</Label>
              <Input
                id="firstName"
                placeholder="Nome"
                value={guestData.firstName}
                onChange={(e) => updateGuestData({ firstName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Sobrenome</Label>
              <Input
                id="lastName"
                placeholder="Sobrenome"
                value={guestData.lastName}
                onChange={(e) => updateGuestData({ lastName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="CPF">CPF</Label>
              <Input
                id="CPF"
                type="CPF"
                placeholder="xxx.xxx.xxx-xx"
                value={guestData.cpf}
                onChange={(e) => updateGuestData({ cpf: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="birthday">Data de Nascimento</Label>
              <Input
                id="birthday"
                type="date"
                placeholder="dd / mm / aaaa"
                className="w-full"
                value={guestData.birthday}
                onChange={(e) => updateGuestData({ birthday: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="exemplo@email.com"
                value={guestData.email}
                onChange={(e) => updateGuestData({ email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                value={guestData.phone}
                onChange={(e) => updateGuestData({ phone: e.target.value })}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
