using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace project_alpha_0._1
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
            Start();
            button1.Click += signinFunction;
            button2.Click += closingFunction;
        }

        public void Start()
        {
            Image image = Image.FromFile("hatter_main.jpeg");
            this.BackgroundImage = image;

            this.FormBorderStyle = FormBorderStyle.None;

            dataGridView1.BackgroundColor = Color.FromArgb(93, 135, 54);
            label1.BackColor = Color.FromArgb(93, 135, 54);
            label2.BackColor = Color.FromArgb(93, 135, 54);
            pictureBox1.BackColor = Color.FromArgb(93, 135, 54);

            label1.Text = "Park1t&Go";
            label2.Text = "Admin felület";
            button1.Text = "Bejelentkezés";
            button2.Text = "Bezárás";

            int labelMid = label1.Width / 2;
            int label2Mid = label2.Width / 2;
            int dGWmid = dataGridView1.Width / 2;
            int siBtnMid = button1.Width / 2;
            int exitBtnMid = button2.Width / 2;
            label1.Left = this.Width / 2 - labelMid;
            label2.Left = this.Width / 2 - label2Mid;
            dataGridView1.Left = this.Width / 2 - dGWmid;
            button1.Left = this.Width / 2 - siBtnMid;
            button2.Left = this.Width / 2 - exitBtnMid;

            dataGridView1.Height = this.Height - 80;

            int dGWmidH = dataGridView1.Height / 2;
            dataGridView1.Top = this.Height / 2 - dGWmidH;

            int pbMiddle = pictureBox1.Width / 2;
            pictureBox1.Left = this.Width / 2 - pbMiddle;
        }

        public void signinFunction(object s, EventArgs e)
        {
            this.Hide();
            signIn signInForm = new signIn();
            signInForm.Show();
        }

        public void closingFunction(object s, EventArgs e)
        {
            const string message = "Biztosan be akarod zárni?";
            const string caption = "Bezárás";
            var result = MessageBox.Show(message, caption, MessageBoxButtons.YesNo, MessageBoxIcon.Question);

            if (result == DialogResult.Yes)
            {
                Application.Exit();
            }
        }
    }
}
