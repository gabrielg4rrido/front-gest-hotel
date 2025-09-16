import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Breadcrumb } from './Breadcrumb';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X } from 'lucide-react';

interface PersonalInfoPageProps {
  onNavigate: (page: string) => void;
}

export function PersonalInfoPage({ onNavigate }: PersonalInfoPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    birthDate: '1985-03-15',
    documents: {
      cpf: '123.456.789-00',
      rg: '12.345.678-9',
      passport: 'BR1234567'
    },
    preferences: {
      roomType: 'Quarto com vista para o mar',
      bedType: 'Cama king size',
      smokingPreference: 'Não fumante',
      dietaryRestrictions: 'Vegetariano'
    }
  });

  const [editedInfo, setEditedInfo] = useState(userInfo);

  const breadcrumbItems = [
    { label: 'Meus Dados', href: '#' }
  ];

  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo(userInfo);
  };

  const handleSave = () => {
    setUserInfo(editedInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInfo(userInfo);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string, section?: string) => {
    if (section) {
      setEditedInfo(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: value
        }
      }));
    } else {
      setEditedInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl mb-2">Informações Pessoais</h1>
            <p className="text-gray-600">Gerencie seus dados e preferências</p>
          </div>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit}>
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="h-fit">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
                  <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                </div>
              </div>
              <CardTitle>{userInfo.name}</CardTitle>
              <CardDescription>{userInfo.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{userInfo.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="flex-1">{userInfo.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span>{new Date(userInfo.birthDate).toLocaleDateString('pt-BR')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Data */}
            <Card>
              <CardHeader>
                <CardTitle>Dados Pessoais</CardTitle>
                <CardDescription>Informações básicas da sua conta</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedInfo.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  ) : (
                    <p className="py-2 px-3 bg-gray-50 rounded-md">{userInfo.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  ) : (
                    <p className="py-2 px-3 bg-gray-50 rounded-md">{userInfo.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editedInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  ) : (
                    <p className="py-2 px-3 bg-gray-50 rounded-md">{userInfo.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  {isEditing ? (
                    <Input
                      id="birthDate"
                      type="date"
                      value={editedInfo.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    />
                  ) : (
                    <p className="py-2 px-3 bg-gray-50 rounded-md">
                      {new Date(userInfo.birthDate).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Endereço</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={editedInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  ) : (
                    <p className="py-2 px-3 bg-gray-50 rounded-md">{userInfo.address}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Documentos</CardTitle>
                <CardDescription>Informações de documentos pessoais</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  {isEditing ? (
                    <Input
                      id="cpf"
                      value={editedInfo.documents.cpf}
                      onChange={(e) => handleInputChange('cpf', e.target.value, 'documents')}
                    />
                  ) : (
                    <p className="py-2 px-3 bg-gray-50 rounded-md">{userInfo.documents.cpf}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rg">RG</Label>
                  {isEditing ? (
                    <Input
                      id="rg"
                      value={editedInfo.documents.rg}
                      onChange={(e) => handleInputChange('rg', e.target.value, 'documents')}
                    />
                  ) : (
                    <p className="py-2 px-3 bg-gray-50 rounded-md">{userInfo.documents.rg}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passport">Passaporte</Label>
                  {isEditing ? (
                    <Input
                      id="passport"
                      value={editedInfo.documents.passport}
                      onChange={(e) => handleInputChange('passport', e.target.value, 'documents')}
                    />
                  ) : (
                    <p className="py-2 px-3 bg-gray-50 rounded-md">{userInfo.documents.passport}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Preferências</CardTitle>
                <CardDescription>Suas preferências para estadias</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roomType">Tipo de Quarto Preferido</Label>
                  {isEditing ? (
                    <Input
                      id="roomType"
                      value={editedInfo.preferences.roomType}
                      onChange={(e) => handleInputChange('roomType', e.target.value, 'preferences')}
                    />
                  ) : (
                    <p className="py-2 px-3 bg-gray-50 rounded-md">{userInfo.preferences.roomType}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedType">Tipo de Cama</Label>
                  {isEditing ? (
                    <Input
                      id="bedType"
                      value={editedInfo.preferences.bedType}
                      onChange={(e) => handleInputChange('bedType', e.target.value, 'preferences')}
                    />
                  ) : (
                    <p className="py-2 px-3 bg-gray-50 rounded-md">{userInfo.preferences.bedType}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smokingPreference">Preferência sobre Fumantes</Label>
                  {isEditing ? (
                    <Input
                      id="smokingPreference"
                      value={editedInfo.preferences.smokingPreference}
                      onChange={(e) => handleInputChange('smokingPreference', e.target.value, 'preferences')}
                    />
                  ) : (
                    <p className="py-2 px-3 bg-gray-50 rounded-md">{userInfo.preferences.smokingPreference}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dietaryRestrictions">Restrições Alimentares</Label>
                  {isEditing ? (
                    <Input
                      id="dietaryRestrictions"
                      value={editedInfo.preferences.dietaryRestrictions}
                      onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value, 'preferences')}
                    />
                  ) : (
                    <p className="py-2 px-3 bg-gray-50 rounded-md">{userInfo.preferences.dietaryRestrictions}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}