using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace project_alpha_0._1
{
    public partial class signIn : Form
    {
        public signIn()
        {
            InitializeComponent();
            this.AcceptButton = button2; // enter gomb = bejelentkezés
            Start();
            button1.Click += closeFunc;
            button2.Click += signInFunc;
        }

        public void Start()
        {
            button1.Text = "Bezárás";
            button2.Text = "Bejelentkezés";
            label1.Text = "Bejelentkezés";
            label2.Text = "Felhasználónév:";
            label3.Text = "Jelszó:";

            textBox2.PasswordChar = '∗';

            int label1Middle = label1.Width / 2;
            label1.Left = this.Width / 2 - label1Middle;

            button1.Left = this.Width / 2 - (button1.Width + 40);
            button2.Left = this.Width / 2 + 40;

            this.FormBorderStyle = FormBorderStyle.None;

            //Image kiskocsi = Image.FromFile("kiskocsi.png");
        }

        public void signInFunc(object s, EventArgs e)
        {
            var user = textBox1.Text.ToLower();
            var pass = textBox2.Text.ToLower();
            if (user == "admin" && pass == "admin")
            {
                this.Hide();
                Menu menu = new Menu();
                menu.ShowDialog();
            }
            else
            {
                //MessageBox.Show("Helytelen felhasználónév vagy jelszó!");
                const string message = "Helytelen felhasználónév vagy jelszó!";
                const string caption = "Helytelen adat";
                MessageBox.Show(message, caption, MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }

        public void closeFunc(object s, EventArgs e)
        {
            const string message = "Biztosan be akarod zárni?";
            const string caption = "Bezárás";
            var result = MessageBox.Show(message, caption, MessageBoxButtons.YesNo, MessageBoxIcon.Question);

            if (result == DialogResult.Yes)
            {
                /*this.Hide();
                Form1 form1 = new Form1();
                form1.ShowDialog();*/

                Application.Exit();
            }
        }
    }
}
