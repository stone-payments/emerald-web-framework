export default function formatCNPJ(cnpj) {
  cnpj.replace(/[^\d]/g, '')

  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  )
}
// Example of use:
const cnpj = '12345678000199'
const cnpjFormatado = formatCNPJ(cnpj)
console.log("CNPJ Formatado ==>", cnpjFormatado)


export default function formatCPF(cpf) {
  cpf.replace(/[^\d]/g, '')

  return cpf.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4'
  )
}
// Example of use:
const cpf = '12345678901';
const cpfFormatado = formatCPF(cpf);
console.log(cpfFormatado);

export default function formatCNPJRoot(cnpjRoot) {
  cnpjRoot.replace(/[^\d]/g, '')

  return cnpjRoot.replace(
    /^(\d{2})(\d{3})(\d{3})$/, '$1.$2.$3'
  )
}
// Example of use:
const cnpjRoot = '12345678';
const cnpjRootFormatado = formatCNPJRoot(cnpjRoot);
console.log(cnpjRootFormatado);
