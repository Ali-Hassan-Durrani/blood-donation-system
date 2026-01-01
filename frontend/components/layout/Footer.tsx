export default function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-6 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900">VitaFlow</h3>
          <p className="mt-2 text-sm text-gray-600">
            Connecting donors, seekers, hospitals, and blood banks to save lives.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900">Quick Links</h4>
          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            <li>How it works</li>
            <li>Blood compatibility</li>
            <li>Centers</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900">Made for</h4>
          <p className="mt-2 text-sm text-gray-600">
            Academic project & real-world healthcare workflows.
          </p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 pb-4">
        © {new Date().getFullYear()} VitaFlow. All rights reserved.
      </div>
    </footer>
  );
}